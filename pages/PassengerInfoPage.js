const BasePage = require("./BasePage");

class PassengerInfoPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      passengerRow: '[role="row"]:has-text("فرزاد نیکرفتارخیابانی")',
      passengerCheckbox:
        '[role="row"]:has-text("فرزاد نیکرفتارخیابانی") [role="checkbox"]',
      confirmButton: 'button:has-text("تایید و ادامه")',
    };
  }

  async selectPassenger() {
    const passengerName = this.config.passenger.name;
    const passengerRow = this.page.getByRole("row", {
      name: passengerName,
    });
    const passengerCheckbox = passengerRow.getByRole("checkbox");

    await passengerCheckbox.check();

    await this.wait();
    console.log("✅ Passenger selected successfully");
  }

  async clickConfirmAndContinue() {
    // Check for timeout modal before final confirmation
    await this.checkTimeoutModal();

    const confirmButton = this.page.getByRole("button", {
      name: "تایید و ادامه",
    });

    await confirmButton.click();
    await this.wait();

    console.log("✅ Passenger information confirmed");
  }

  async completePassengerInfo() {
    console.log("👤 Completing passenger information...");

    await this.selectPassenger();
    await this.clickConfirmAndContinue();

    console.log("✅ Passenger information completed");
  }
}

module.exports = PassengerInfoPage;
