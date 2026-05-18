from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from io import BytesIO
import os
import json

import requests
from PyPDF2 import PdfReader
from bse import BSE
from dotenv import load_dotenv

# 🔹 NEW: Agno + Groq (agentic summarizer)
from agno.agent import Agent
from agno.models.groq import Groq

# --------------------------------------------------------------------
# ENV + AGENT SETUP
# --------------------------------------------------------------------

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in environment (.env)")

# Agno uses GROQ_API_KEY from env internally, we just define the model ID here.
bse_summary_agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    description=(
        "You summarize official BSE / stock-exchange filings and announcements for investors. "
        "You MUST NOT hallucinate or guess, and you must strictly follow the requested output format."
    ),
    markdown=False,   # we want plain text, not markdown formatting
)

# Ensure downloads folder exists
os.makedirs("./downloads", exist_ok=True)


# --------------------------------------------------------------------
# PDF FETCH + TEXT EXTRACTION
# --------------------------------------------------------------------

def get_pdf_text_from_attachment(attach_name: str) -> tuple[str, str]:
    """
    Given an ATTACHMENTNAME from BSE (e.g. 'abcd1234.pdf'),
    try downloading from AttachLive, then AttachHis, and
    return (raw_text, final_url_used).
    """
    if not attach_name:
        return "", ""

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Referer": "https://www.bseindia.com/",
        "Accept": "application/pdf,application/octet-stream;q=0.9,*/*;q=0.8",
    }

    base_paths = [
        "https://www.bseindia.com/xml-data/corpfiling/AttachLive/",
        "https://www.bseindia.com/xml-data/corpfiling/AttachHis/",
    ]

    last_status = None
    last_url = None
    resp_content = None
    final_url = ""

    for base in base_paths:
        url = base + attach_name
        last_url = url

        resp = requests.get(url, headers=headers, timeout=30)
        last_status = resp.status_code

        if resp.status_code == 200:
            resp_content = resp.content
            final_url = url
            break
        elif resp.status_code in (403, 404):
            continue
        else:
            continue

    if resp_content is None:
        raise RuntimeError(
            f"Could not fetch PDF after trying live & history. "
            f"Last HTTP status: {last_status}, URL: {last_url}"
        )

    pdf_bytes = BytesIO(resp_content)
    reader = PdfReader(pdf_bytes)

    all_text_parts = []
    for page in reader.pages:
        text = page.extract_text() or ""
        all_text_parts.append(text)

    return "\n".join(all_text_parts), final_url


# --------------------------------------------------------------------
# AGENTIC SUMMARIZATION (Agno + Groq)
# --------------------------------------------------------------------

def summarize_with_groq(
    pdf_text: str,
    heading: str,
    news_date: str,
    pdf_url: str,
) -> str:
    """
    Use an Agno agent (Groq Llama) to turn raw PDF text + BSE heading into:
    - Title
    - Summary (no hallucinations)
    Then append the source PDF link.

    Output format stays EXACTLY like before so callers (main.py) do not change.
    """
    max_chars = 12000
    trimmed = (pdf_text or "").strip()
    if len(trimmed) > max_chars:
        trimmed = trimmed[:max_chars]

    short_text = len(trimmed) < 500

    guard_clause = (
        "The text is very short or noisy, so you MUST be extremely conservative. "
        "If you cannot clearly find a detail, say 'not clearly specified in the filing'. "
    ) if short_text else ""

    prompt = f"""
You are summarizing an official stock-exchange filing / corporate announcement for investors.
You MUST NOT guess or invent details. Only state what is explicitly present in the text
or in the BSE heading. If something is not clearly mentioned, say "not clearly specified in the filing".

BSE heading (from website):
"{heading}"

Announcement date (from website):
"{news_date}"

{guard_clause}

Given the filing text below, write:

1. A clear, short TITLE (max 120 characters) that is consistent with the heading.
2. A concise SUMMARY (max 5 bullet points) that ONLY includes:
   - What happened (as explicitly described)
   - Any key numbers, amounts or dates that are clearly mentioned
   - Impact / relevance to shareholders or business, but ONLY if the text mentions it

If you are unsure about any detail, DO NOT guess. Instead say:
"not clearly specified in the filing" for that point.

Return the answer in EXACTLY this format:

Title: <one-line title>

Summary:
- <point 1>
- <point 2>
- <point 3>

Here is the filing text:

\"\"\"{trimmed}\"\"\"""".strip()

    # Use Agno agent instead of manual Groq client
    try:
        response = bse_summary_agent.run(input=prompt)
        content = str(response.content).strip()
    except Exception as e:
        # Bubble up (caller already handles per-announcement errors)
        raise RuntimeError(f"Groq summary error: {e}") from e

    content_with_link = content + (f"\n\nSource PDF: {pdf_url}" if pdf_url else "")
    return content_with_link


# --------------------------------------------------------------------
# BSE ANNOUNCEMENT FETCH + RESOLUTION HELPERS
# --------------------------------------------------------------------

def fetch_announcements_for_code(
    scripcode: str,
    days: int = 60,
    max_pages: int = 10,
) -> List[Dict[str, Any]]:
    """
    Fetch latest BSE corporate announcements for a given scripcode.
    """
    from_date = datetime.now() - timedelta(days=days)
    to_date = datetime.now()

    bse = BSE(download_folder="./downloads")

    all_rows: List[Dict[str, Any]] = []
    page_no = 1

    while page_no <= max_pages:
        data = bse.announcements(
            page_no=page_no,
            from_date=from_date,
            to_date=to_date,
            scripcode=scripcode,
        )

        table = data.get("Table") or []
        if not table:
            break

        all_rows.extend(table)

        table1 = data.get("Table1") or []
        if table1:
            total_rows = table1[0].get("ROWCNT")
            if total_rows and len(all_rows) >= int(total_rows):
                break

        page_no += 1

    def sort_key(row: Dict[str, Any]):
        dt_str = row.get("NEWS_DT") or ""
        try:
            return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        except Exception:
            return datetime.min

    all_rows.sort(key=sort_key, reverse=True)
    return all_rows


def extract_heading_and_date(row: Dict[str, Any]) -> tuple[str, str]:
    heading = (
        row.get("HEADING")
        or row.get("HEADLINE")
        or row.get("SUBJECT")
        or row.get("NEWS_SUBJECT")
        or row.get("NEWSSUBJECT")
        or row.get("NEWS_DESC")
        or row.get("NEWS_DESCRIPTION")
        or "No heading"
    )

    news_dt = row.get("NEWS_DT", "No date")
    try:
        dt = datetime.fromisoformat(news_dt.replace("Z", "+00:00"))
        news_date_str = dt.strftime("%d/%m/%Y")
    except Exception:
        news_date_str = news_dt.split(" ")[0] if news_dt else "No date"

    return heading, news_date_str


def resolve_scripcode(stock_identifier: str) -> Optional[str]:
    """
    If numeric, treat as scripcode directly.
    Otherwise, try to resolve via BSE getScripCode.
    """
    stock_identifier = (stock_identifier or "").strip()
    if not stock_identifier:
        return None

    if stock_identifier.isdigit():
        return stock_identifier  # already a scripcode

    bse = BSE(download_folder="./downloads")
    try:
        code = bse.getScripCode(stock_identifier)
        return str(code) if code else None
    except Exception:
        return None


# --------------------------------------------------------------------
# HIGH-LEVEL ENTRYPOINT (used by main.py)
# --------------------------------------------------------------------

def summarize_announcements_for_stock(
    stock_identifier: str,
    days: int = 60,
    max_news: int = 3,
) -> Dict[str, Any]:
    """
    High-level helper:
    - Resolve stock_identifier -> scripcode
    - Fetch announcements
    - For each of top `max_news` announcements with PDF, extract text & summarize
    - Return a dict ready to be JSON-ified

    IMPORTANT: Output shape is unchanged so main.py and callers don't need edits.
    """
    result: Dict[str, Any] = {
        "stock": stock_identifier,
        "scripcode": None,
        "news": [],
        "error": None,
    }

    scripcode = resolve_scripcode(stock_identifier)
    if not scripcode:
        result["error"] = "Could not resolve scrip code"
        return result

    result["scripcode"] = scripcode

    try:
        rows = fetch_announcements_for_code(scripcode, days=days)
    except Exception as e:
        result["error"] = f"Error fetching announcements: {e}"
        return result

    if not rows:
        result["error"] = "No announcements found"
        return result

    news_items: List[Dict[str, Any]] = []
    count = 0

    for idx, row in enumerate(rows):
        if count >= max_news:
            break

        attach_name = row.get("ATTACHMENTNAME")
        if not attach_name or not attach_name.lower().endswith(".pdf"):
            continue  # skip non-PDF or missing attachments

        heading, news_date = extract_heading_and_date(row)

        try:
            pdf_text, pdf_url = get_pdf_text_from_attachment(attach_name)
            if not pdf_text.strip():
                continue

            summary_text = summarize_with_groq(pdf_text, heading, news_date, pdf_url)

            news_items.append(
                {
                    "index": idx + 1,
                    "heading": heading,
                    "date": news_date,
                    "pdf_url": pdf_url,
                    "summary": summary_text,  # full text: Title + bullets + source
                    "attachment_name": attach_name,
                }
            )
            count += 1

        except Exception as e:
            # Add partial error info for this particular news
            news_items.append(
                {
                    "index": idx + 1,
                    "heading": heading,
                    "date": news_date,
                    "pdf_url": None,
                    "summary": None,
                    "attachment_name": attach_name,
                    "error": f"Error summarizing: {e}",
                }
            )
            count += 1

    result["news"] = news_items
    if not news_items and not result["error"]:
        result["error"] = "No PDF-based announcements to summarize"

    return result
