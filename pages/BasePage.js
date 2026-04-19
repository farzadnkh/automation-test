const { expect } = require("@playwright/test");
const config = require("../config/test-config");

class BasePage {
  constructor(page) {
    this.page = page;
    this.config = config;
  }

  async navigateTo(url) {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 1000,
    });

    console.log(`✅ Successfully navigated to ${url}`);
  }

  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForElementToBeVisible(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: "visible", timeout });
  }

  async waitForElementToBeEnabled(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: "attached", timeout });
    await expect(this.page.locator(selector)).toBeEnabled({ timeout });
  }

  async wait(ms = null) {
    const waitTime = ms || this.config.environment.waitTimeout;
    await this.page.waitForTimeout(waitTime);
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  async reload() {
    await this.page.reload();
    await this.wait(5000);
  }

  // Helper function to check and handle timeout modal
  async checkTimeoutModal() {
    try {
      const timeoutModal = this.page.getByText(
        "متاسفانه مدت زمان تکمیل فرایند خرید به اتمام رسیده است. لطفا جستجوی خود را بروز"
      );
      if (await timeoutModal.isVisible({ timeout: 2000 })) {
        console.log("⚠️ Timeout modal detected, refreshing search...");
        await timeoutModal.click();
        await this.page
          .getByRole("button", { name: "بروز‌رسانی مجدد" })
          .click();
        await this.wait(10000); // Wait for refresh
        return true; // Modal was found and handled
      }
    } catch (error) {
      // No modal found, continue
    }
    return false; // No modal found
  }

  // Helper function to check for error toasts
  async checkForErrors() {
    // Check for internal error
    try {
      const internalError = this.page.getByText("خطای داخلی رخ داده است");
      if (await internalError.isVisible({ timeout: 2000 })) {
        console.log("❌ Internal error detected, test failed");
        throw new Error("Internal error occurred during booking process");
      }
    } catch (error) {
      if (error.message.includes("Internal error")) {
        throw error;
      }
    }

    // Check for reservation error
    try {
      const reservationError = this.page.getByText(
        "با عرض پوزش در فرایند رزرو شما مشکلی پیش آمده لطفا مجددا جهت انتخاب بلیط و رزرو"
      );
      if (await reservationError.isVisible({ timeout: 2000 })) {
        console.log("❌ Reservation error detected, test failed");
        await reservationError.click();
        throw new Error("Reservation error occurred during booking process");
      }
    } catch (error) {
      if (error.message.includes("Reservation error")) {
        throw error;
      }
    }
  }
}

module.exports = BasePage;
