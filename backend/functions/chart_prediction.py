# functions/chart_prediction.py

import base64
import json
import os
import re
from typing import Dict, Any

from dotenv import load_dotenv
from groq import Groq

# 🔹 NEW: Agno for agentic post-processing
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.groq import Groq as AgnoGroq

# Load env vars
load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")
VISION_MODEL = os.getenv(
    "GROQ_VISION_MODEL",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
)

if not API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in environment (.env)")

# --------------------------------------------------------------------
# Agno agent schema: normalize + validate the pattern info
# --------------------------------------------------------------------

class ChartPatternSchema(BaseModel):
    pattern_found: bool = Field(
        description="Whether a clear, classical chart pattern is visible."
    )
    pattern_name: str = Field(
        description="Name of the main pattern, or 'None' if not found."
    )
    confidence: str = Field(
        description="Text label of confidence such as 'low', 'moderate', or 'high'."
    )
    explanation: str = Field(
        description="Short explanation in plain language of what was detected and why."
    )


chart_pattern_agent = Agent(
    model=AgnoGroq(id="llama-3.3-70b-versatile"),
    description=(
        "You are a cautious assistant that cleans and normalizes the result of a separate vision model "
        "for candlestick chart patterns. You do NOT analyze the image yourself; instead you read the "
        "raw text/JSON output from a vision model and convert it into a consistent JSON structure with "
        "fields: pattern_found (bool), pattern_name (str), confidence (str), explanation (str)."
    ),
    output_schema=ChartPatternSchema,
    markdown=False,
)

# --------------------------------------------------------------------
# Image encoding helper (unchanged)
# --------------------------------------------------------------------

def encode_image(path: str) -> str:
    """
    Read image and return base64-encoded string.
    """
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


# --------------------------------------------------------------------
# Vision + Agentic normalization
# --------------------------------------------------------------------

def detect_chart_pattern(image_path: str) -> Dict[str, Any]:
    """
    Call Groq vision model on the given candlestick chart image.
    NOW agentic (two step):
      1) Vision model returns a raw JSON-ish description of pattern.
      2) Agno agent (text model) normalizes & validates into a strict schema.

    Still returns a Python dict with:
    {
      "pattern_found": bool,
      "pattern_name": str,
      "confidence": str,
      "explanation": str
    }
    so main.py / callers don't need to change.
    """
    b64 = encode_image(image_path)

    # ---------- Step 1: Vision model (unchanged core logic) ----------
    client = Groq(api_key=API_KEY)

    prompt = """
You are an expert stock market technical analyst.
You look at a candlestick chart image and identify if any classical chart pattern
is clearly visible, such as:
- Head and Shoulders
- Inverse Head and Shoulders
- Double Top / Double Bottom
- Cup and Handle
- Ascending / Descending Triangle
- Symmetrical Triangle
- Bullish / Bearish Flag
- Wedge patterns (Rising/Falling)
- Rounding Bottom
- Trend reversal / breakout setup

Respond only in JSON like this example:

{
  "pattern_found": true,
  "pattern_name": "Double Bottom",
  "confidence": "moderate",
  "explanation": "two clear lows forming W-shape near same level, strong bounce after second low"
}

If no clear pattern appears, return:

{
  "pattern_found": false,
  "pattern_name": "None",
  "confidence": "low",
  "explanation": "No reliable or identifiable classical chart pattern present"
}
"""

    response = client.chat.completions.create(
        model=VISION_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{b64}"
                        }
                    }
                ]
            }
        ],
        temperature=0,
        max_tokens=700,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if present
    clean = re.sub(r"^```(?:json)?", "", raw).strip()
    clean = re.sub(r"```$", "", clean).strip()

    # ---------- Step 2: Agentic normalization via Agno ----------
    try:
        # Let the Agno agent read the raw vision output and normalize it.
        instruction = (
            "You are given the raw JSON or text output from a separate vision model "
            "that analyzed a candlestick chart. The output may be slightly malformed JSON, "
            "but it usually tries to follow this structure: "
            "{pattern_found, pattern_name, confidence, explanation}.\n\n"
            "Your job is to convert it into a clean JSON object with exactly these fields:\n"
            "- pattern_found: boolean\n"
            "- pattern_name: string (use 'None' if nothing clear)\n"
            "- confidence: string label like 'low', 'moderate', or 'high'\n"
            "- explanation: short text summarizing what pattern (or lack of pattern) is present.\n\n"
            "Raw vision model output:\n"
            f"{clean}\n"
        )

        agent_resp = chart_pattern_agent.run(input=instruction)
        pattern_obj: ChartPatternSchema = agent_resp.content

        return {
            "pattern_found": bool(pattern_obj.pattern_found),
            "pattern_name": str(pattern_obj.pattern_name),
            "confidence": str(pattern_obj.confidence),
            "explanation": str(pattern_obj.explanation),
        }

    except Exception as e:
        # Fallback: if agent step fails, try naive JSON parse of the raw output;
        # if that also fails, return a safe default.
        try:
            data = json.loads(clean)
            return {
                "pattern_found": bool(data.get("pattern_found", False)),
                "pattern_name": str(data.get("pattern_name", "ParseError")),
                "confidence": str(data.get("confidence", "low")),
                "explanation": str(
                    data.get(
                        "explanation",
                        f"Agent normalization failed ({e}); used raw vision JSON.",
                    )
                ),
            }
        except json.JSONDecodeError:
            # ultimate fallback
            return {
                "pattern_found": False,
                "pattern_name": "ParseError",
                "confidence": "low",
                "explanation": f"Could not parse model JSON. Raw output: {clean}",
            }
