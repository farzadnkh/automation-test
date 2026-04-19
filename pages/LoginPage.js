const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      loginButton: 'button:has-text("ورود/ ثبت نام")',
      phoneInput: 'input[type="tel"], input[name="phoneNumber"]',
      nationalCodeInput: 'input[name="national_code"]',
      activationCodeButton: 'button:has-text("دریافت کد فعال سازی")',
      otpInputs: 'input[placeholder=" "]',
    };
  }

  async clickLoginButton() {
    await this.page.getByRole("button", { name: "ورود/ ثبت نام" }).click();
    await this.wait(5000);
  }

  async fillPhoneNumber(phoneNumber = null) {
    const phone = phoneNumber || this.config.credentials.phoneNumber;
    await this.page.getByRole("textbox").nth(4).click();
    await this.wait();
    await this.page.getByRole("textbox").nth(4).fill(phone);
    await this.wait();
  }

  async fillNationalCode(nationalCode = null) {
    const code = nationalCode || this.config.credentials.nationalCode;
    await this.page.getByRole("textbox").nth(5).click();
    await this.wait();
    await this.page.getByRole("textbox").nth(5).fill(code);
    await this.wait();
  }

  async clickActivationCodeButton() {
    await this.page
      .getByRole("button", { name: "دریافت کد فعال سازی" })
      .nth(1)
      .click();
    await this.wait(5000);
  }

  async fillOTP(otp = null) {
    const otpCode = otp || this.config.credentials.otp;
    // Fill OTP digits one by one
    for (let i = 0; i < 6; i++) {
      await this.page.getByPlaceholder(" ").nth(i).fill(otpCode[i]);
      await this.wait(1000);
    }
    await this.wait(1000);
  }

  async performLogin(credentials = {}) {
    const {
      phoneNumber = this.config.credentials.phoneNumber,
      nationalCode = this.config.credentials.nationalCode,
      otp = this.config.credentials.otp,
    } = credentials;

    console.log("🔐 Starting login process...");

    await this.clickLoginButton();
    await this.fillPhoneNumber(phoneNumber);
    await this.fillNationalCode(nationalCode);
    await this.clickActivationCodeButton();
    await this.fillOTP(otp);

    // Reload page after login
    await this.reload(5000);

    console.log("✅ Login completed successfully");
  }
}

module.exports = LoginPage;
