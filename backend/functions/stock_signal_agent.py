# agentic/stock_signal_agent.py

from typing import Dict, List, Literal
from pydantic import BaseModel, Field

from agno.agent import Agent
from agno.models.groq import Groq
from agno.tools.duckduckgo import DuckDuckGoTools


# ---------- INPUT (what we feed from backend) ----------

class StockSignalInput(BaseModel):
    ticker: str = Field(..., description="Yahoo-style ticker, e.g. RELIANCE.NS")
    ratios: Dict[str, float] = Field(
        default_factory=dict,
        description="Financial ratios from your existing ratios function (no math done by LLM).",
    )


# ---------- OUTPUT (what frontend will get) ----------

class StockSignalOutput(BaseModel):
    ticker: str
    bias: Literal["bullish", "neutral", "bearish"] = Field(
        description="Overall directional bias, NOT a direct trade instruction."
    )
    confidence: int = Field(
        ge=0, le=100,
        description="Confidence in this bias, as a percentage."
    )

    reasons: List[str] = Field(
        default_factory=list,
        description="Key bullet reasons combining fundamentals + web info.",
    )
    risks: List[str] = Field(
        default_factory=list,
        description="Main risk factors / cautions.",
    )
    latest_headlines: List[str] = Field(
        default_factory=list,
        description="Short headlines / takeaways from web search, if used.",
    )
    note: str = Field(
        default="This is an AI-generated educational view based on public information and ratios, not financial advice.",
        description="Safety disclaimer.",
    )


# ---------- AGNO AGENT ----------

stock_signal_agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    input_schema=StockSignalInput,
    output_schema=StockSignalOutput,
    description=(
        "You are a cautious stock analysis assistant. "
        "You receive PRE-COMPUTED financial ratios (from Python). "
        "Use the ratios like a real analyst (ROE, ROCE, Debt/Equity, margins, liquidity, etc.). "
        "Output a bullish/neutral/bearish BIAS and confidence with reasons & risks. "
        "NEVER tell the user to buy or sell, and NEVER give exact targets/stop-loss levels."
    ),
)



def run_stock_signal(input_data: StockSignalInput) -> StockSignalOutput:
    """
    Wrapper for Flask: runs agent and returns a Pydantic StockSignalOutput.
    """
    resp = stock_signal_agent.run(input=input_data)
    return resp.content
