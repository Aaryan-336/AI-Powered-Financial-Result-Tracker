# functions/financial_ratios.py

import os
import yfinance as yf
import numpy as np

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")  # optional, backup
ALPHA_BASE_URL = "https://www.alphavantage.co/query"


def get_data_yahoo(ticker_symbol: str):
    """
    Fetches raw financial statements using yfinance.
    Returns a dictionary of DataFrames or None if failed.
    """
    try:
        stock = yf.Ticker(ticker_symbol)

        bs = stock.balance_sheet
        inc = stock.financials
        cf = stock.cashflow

        if bs is None or inc is None or bs.empty or inc.empty:
            return None

        return {"bs": bs, "inc": inc, "cf": cf}
    except Exception:
        return None


def get_field(df, possible_names, year_index=0):
    """
    Safely retrieves a value from a DataFrame row looking for multiple possible index names.
    year_index: 0 for current year, 1 for previous year.
    """
    if df is None:
        return 0

    found_name = None
    for name in possible_names:
        if name in df.index:
            found_name = name
            break

    if not found_name:
        return 0

    try:
        return df.loc[found_name].iloc[year_index]
    except IndexError:
        return 0


def calculate_ratios(data, source="Yahoo"):
    """
    Calculates the ratios based on the provided raw data (BS, INC, CF).
    Returns a dict of ratios.
    """
    ratios = {}

    bs = data.get("bs")
    inc = data.get("inc")

    def val(df, names, year=0):
        return get_field(df, names, year)

    # --- 1. EXTRACT RAW DATA ---

    # Balance Sheet Items
    total_debt = val(
        bs,
        [
            "Total Debt",
            "Long Term Debt And Capital Lease Obligation",
            "Total Liab",
        ],
    )
    if total_debt == 0:
        total_debt = val(bs, ["Long Term Debt"]) + val(bs, ["Current Debt"])

    total_equity = val(
        bs,
        [
            "Stockholders Equity",
            "Total Stockholder Equity",
            "Total Equity Gross Minority Interest",
        ],
    )
    total_assets = val(bs, ["Total Assets"])
    total_curr_assets = val(bs, ["Current Assets", "Total Current Assets"])
    total_curr_liab = val(bs, ["Current Liabilities", "Total Current Liabilities"])
    inventory_curr = val(bs, ["Inventory"])
    inventory_prev = val(bs, ["Inventory"], year=1)
    receivables_curr = val(
        bs,
        ["Receivables", "Net Receivables", "Accounts Receivable"],
    )
    receivables_prev = val(
        bs,
        ["Receivables", "Net Receivables", "Accounts Receivable"],
        year=1,
    )

    # Income Statement Items
    revenue = val(inc, ["Total Revenue", "Operating Revenue"])
    ebit = val(
        inc,
        [
            "EBIT",
            "Operating Income",
            "Net Income From Continuing And Discontinued Operation",
        ],
    )
    if ebit == 0:
        ebit = val(inc, ["Pretax Income"]) + val(inc, ["Interest Expense"])

    interest_expense = val(
        inc,
        [
            "Interest Expense",
            "Interest Expense Non Operating",
        ],
    )
    interest_expense = abs(interest_expense)

    net_income = val(inc, ["Net Income", "Net Income Common Stockholders"])
    ebitda = val(inc, ["EBITDA", "Normalized EBITDA"])
    cogs = val(inc, ["Cost Of Revenue", "Cost Of Goods Sold"])

    # --- 2. CALCULATE RATIOS ---

    # Avoid division by zero with safe helper
    def safe_div(a, b):
        if b in (0, None) or (isinstance(b, (float, int)) and b == 0):
            return 0.0
        return float(a) / float(b)

    # LEVERAGE
    ratios["Debt/Equity"] = safe_div(total_debt, total_equity)
    ratios["Debt/Assets"] = safe_div(total_debt, total_assets)
    ratios["Interest Coverage"] = safe_div(ebit, interest_expense)

    # PROFITABILITY (%)
    ratios["EBITDA Margin"] = safe_div(ebitda, revenue) * 100 if revenue else 0
    ratios["EBIT Margin"] = safe_div(ebit, revenue) * 100 if revenue else 0
    ratios["Net Profit Margin"] = safe_div(net_income, revenue) * 100 if revenue else 0
    ratios["ROE"] = safe_div(net_income, total_equity) * 100 if total_equity else 0
    ratios["ROA"] = safe_div(net_income, total_assets) * 100 if total_assets else 0
    ratios["ROCE"] = (
        safe_div(ebit, (total_assets - total_curr_liab)) * 100
        if (total_assets - total_curr_liab)
        else 0
    )

    # LIQUIDITY
    ratios["Current Ratio"] = safe_div(total_curr_assets, total_curr_liab)
    ratios["Quick Ratio"] = safe_div(
        (total_curr_assets - inventory_curr), total_curr_liab
    )

    # EFFICIENCY
    avg_inventory = (
        (inventory_curr + inventory_prev) / 2 if inventory_prev else inventory_curr
    )
    ratios["Inventory Turnover"] = safe_div(cogs, avg_inventory)

    assets_prev = val(bs, ["Total Assets"], year=1)
    avg_assets = (total_assets + assets_prev) / 2 if assets_prev else total_assets
    ratios["Asset Turnover"] = safe_div(revenue, avg_assets)

    avg_receivables = (
        (receivables_curr + receivables_prev) / 2
        if receivables_prev
        else receivables_curr
    )
    ratios["Receivable Turnover"] = safe_div(revenue, avg_receivables)

    return ratios


def analyze_stock_ratios(ticker: str):
    try:
        data = get_data_yahoo(ticker)
        if not data:
            return {
                "ticker": ticker,
                "source": "Yahoo Finance",
                "ratios": None,
                "error": "Failed to fetch data"
            }

        ratios = calculate_ratios(data)

        return {
            "ticker": ticker,
            "source": "Yahoo Finance",
            "ratios": ratios,
            "error": None,
        }

    except Exception as e:
        return {
            "ticker": ticker,
            "source": "Yahoo Finance",
            "ratios": None,
            "error": str(e)
        }


    return {
        "ticker": ticker,
        "source": "Yahoo Finance",
        "ratios": ratios,
        "error": None,
    }

def get_ratios_for_ticker(ticker: str):
    """
    Wrapper to return only the ratios dict
    so main.py agent & ratios endpoint can consume it easily.
    """
    result = analyze_stock_ratios(ticker)
    if not result or result.get("error"):
        return None
    
    return result.get("ratios")
