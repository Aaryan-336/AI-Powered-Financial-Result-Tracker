# functions/chart_maker.py

import time
from pathlib import Path
import os

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def close_popups(driver):
    """
    Try closing various TradingView popups.
    Safe to call every time after page load.
    """
    selectors = [
        'button[aria-label="Close"]',
        'div.tv-dialog__close',
        "//button[contains(text(),'×')]",
        "//button[contains(text(),'Close')]",
        "//div[contains(@class,'close-button')]",
    ]

    for sel in selectors:
        try:
            if sel.startswith("//"):
                btn = WebDriverWait(driver, 3).until(
                    EC.element_to_be_clickable((By.XPATH, sel))
                )
            else:
                btn = WebDriverWait(driver, 3).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, sel))
                )

            btn.click()
            time.sleep(1)
            print(f"[Popup] Closed using selector: {sel}")
            return
        except Exception:
            continue

    print("[Popup] No popup detected or unable to close")


def get_tradingview_chart_screenshot(
    tv_symbol: str,
    interval: str = "D",
    output_path: str = "chart.png"
) -> str:
    """
    Open TradingView chart for given symbol & interval,
    screenshot the main canvas, save to output_path, and return the absolute path.
    """
    # Ensure charts directory exists
    out_path = Path(output_path)
    if not out_path.parent.exists():
        os.makedirs(out_path.parent, exist_ok=True)

    url = f"https://www.tradingview.com/chart/?symbol={tv_symbol}&interval={interval}"

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=1600,900")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )

    try:
        driver.get(url)
        time.sleep(6)  # allow chart + popup to appear

        # Close promo popup if visible
        close_popups(driver)

        # Look for canvas
        wait = WebDriverWait(driver, 15)
        canvas = None

        try:
            canvas = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, 'div[data-name="pane-0"] canvas')
                )
            )
        except Exception:
            canvases = driver.find_elements(By.TAG_NAME, "canvas")
            if not canvases:
                raise RuntimeError("No canvas found on TradingView page.")
            canvas = max(
                canvases,
                key=lambda c: c.size.get("width", 0) * c.size.get("height", 0)
            )

        time.sleep(2)
        output_path = str(out_path.resolve())
        canvas.screenshot(output_path)
        return output_path

    finally:
        driver.quit()
