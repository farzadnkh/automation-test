const BasePage = require("./BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      refundSection:
        'section:has-text("استرداداسترداد بلیط به‌صورت پیش‌فرض طبق قوانین استرداد انجام می‌شود. با استرداد ")',
      refundLabel: "label",
      discountCodeInput: 'input[name="discountCode"]',
      applyDiscountButton: 'button:has-text("اعمال کد تخفیف")',
      confirmPaymentButton: 'button:has-text("تایید و پرداخت")',
      priceChangeModal: "text=تغییر قیمت",
      priceChangeText:
        "text=مبلغ بلیط به دلیل تغییرات قیمت از سمت تامین کننده افزایش داشته است در صورت تایید",
      continueWithNewPriceButton: 'button:has-text("ادامه با مبلغ جدید")',
      paymentGatewayButton: "text=درگاه پرداخت پارسیان",
      finalPaymentButton: 'button:has-text("تایید و پرداخت")',
    };
  }

  async acceptRefundTerms() {
    console.log("📋 Accepting refund terms...");

    // Check for timeout modal in checkout
    await this.checkTimeoutModal();

    // Accept refund terms
    await this.page
      .locator("section")
      .filter({
        hasText:
          "استرداداسترداد بلیط به‌صورت پیش‌فرض طبق قوانین استرداد انجام می‌شود. با استرداد ",
      })
      .locator("label")
      .click();
    await this.wait(5000);

    await this.page.locator("label").nth(2).click();
    await this.wait(7000);

    console.log("✅ Refund terms accepted");
  }

  async applyDiscountCode(discountCode = null) {
    const code = discountCode || this.config.checkout.discountCode;
    console.log(`🎫 Applying discount code: ${code}`);

    const discountInput = this.page.locator('input[name="discountCode"]');
    const applyButton = this.page.getByRole("button", {
      name: "اعمال کد تخفیف",
    });

    await discountInput.fill(code);

    await this.wait();
    await applyButton.click();
    await this.wait();

    // Check for discount code response messages
    await this.handleDiscountCodeResponse();

    console.log("✅ Discount code process completed");
  }

  async handleDiscountCodeResponse() {
    try {
      // Check for success message
      const successMessage = this.page.getByText("کد تخفیف با موفقیت اعمال شد");
      if (await successMessage.isVisible({ timeout: 3000 })) {
        console.log("✅ Discount code applied successfully");
        await successMessage.click();
        return true;
      }
    } catch (error) {
      // Success message not found, continue checking
    }

    try {
      // Check for wrong code error
      const wrongCodeError = this.page.getByText(
        "کد تخفیف وارد شده اشتباه است"
      );
      if (await wrongCodeError.isVisible({ timeout: 3000 })) {
        console.log("❌ Wrong discount code entered");
        await wrongCodeError.click();
        throw new Error("Invalid discount code provided");
      }
    } catch (error) {
      if (error.message.includes("Invalid discount code")) {
        throw error;
      }
    }

    try {
      // Check for expired code error
      const expiredCodeError = this.page.getByText(
        "کد تخفیف وارد شده اعتبار ندارد"
      );
      if (await expiredCodeError.isVisible({ timeout: 3000 })) {
        console.log("❌ Discount code has expired");
        await expiredCodeError.click();
        throw new Error("Discount code has expired");
      }
    } catch (error) {
      if (error.message.includes("expired")) {
        throw error;
      }
    }

    // If no specific message found, assume it worked
    console.log("ℹ️ No specific discount message found, continuing...");
    return true;
  }

  async handlePriceChange() {
    try {
      const priceChangeModal = this.page.getByText("تغییر قیمت");
      if (await priceChangeModal.isVisible({ timeout: 1000 })) {
        console.log("💰 Price change modal detected, handling...");
        await priceChangeModal.click();
        await this.wait(5000);

        await this.page
          .getByText(
            "مبلغ بلیط به دلیل تغییرات قیمت از سمت تامین کننده افزایش داشته است در صورت تایید"
          )
          .click();
        await this.wait(1000);

        await this.page
          .getByRole("button", { name: "ادامه با مبلغ جدید" })
          .click();
        console.log("✅ Price change accepted");
      }
    } catch (error) {
      console.log("✅ No price change modal found, continuing...");
    }
  }

  async proceedToPayment() {
    console.log("💳 Proceeding to payment...");

    // Final payment
    await this.page.getByRole("button", { name: "تایید و پرداخت" }).click();
    await this.wait(5000);

    // Handle price change if it appears
    await this.handlePriceChange();

    // Check for errors
    await this.checkForErrors();

    // Proceed to payment gateway
    console.log("💳 Proceeding to payment gateway...");
    await this.page.getByText("درگاه پرداخت پارسیان").click();
    await this.wait(5000);
    await this.page.getByRole("button", { name: "تایید و پرداخت" }).click();

    console.log("✅ Payment process completed");
  }

  async completeCheckout(discountCode = null) {
    console.log("🛒 Starting checkout process...");

    await this.acceptRefundTerms();
    await this.applyDiscountCode(discountCode);
    await this.proceedToPayment();

    console.log("✅ Checkout completed successfully");
  }
}

module.exports = CheckoutPage;
