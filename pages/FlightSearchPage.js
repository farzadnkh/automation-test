const BasePage = require("./BasePage");

class FlightSearchPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.selectors = {
      originInput: 'input[placeholder*="مبدا"], [role="textbox"][name*="مبدا"]',
      destinationInput:
        'input[placeholder*="مقصد"], [role="textbox"][name*="مقصد"]',
      departureDateInput:
        'input[name="departureDate"], input[placeholder*="تاریخ رفت"]',
      searchButton: 'button:has-text("جستجوی سفر")',
      flightCard: '.flight-card, [data-testid="flight-card"]',
      accordionHeading: '[id^="accordion__heading-raa-"]',
      selectFlightButton: 'button:has-text("انتخاب بلیط")',
    };
  }

  async selectOrigin(city = null) {
    const origin = city || this.config.flightSearch.origin;
    await this.page.getByRole("textbox", { name: "مبدا" }).click();
    await this.wait();
    await this.page.getByText(origin, { exact: true }).click();
    await this.wait();

    console.log(`✅ Origin selected: ${origin}`);
  }

  async selectDestination(city = null) {
    const destination = city || this.config.flightSearch.destination;
    await this.page.locator("section").getByText(destination).click();
    await this.wait();

    console.log(`✅ Destination selected: ${destination}`);
  }

  async selectDepartureDate() {
    // Select day 17 from config
    const departureDay = this.config.flightSearch.departureDay;
    const persianDay = departureDay.toLocaleString("fa-IR");
    await this.page.getByText(persianDay).nth(1).click();
    await this.wait();
  }

  async clickSearchButton() {
    await this.page.getByRole("button", { name: "جستجوی سفر" }).click();
    await this.wait(5000);
  }

  async waitForSearchResults() {
    console.log("⏳ Waiting 15 seconds for search results...");
    await this.wait(15000);

    // Check for timeout modal
    await this.checkTimeoutModal();

    console.log("🔍 Looking for flight results...");
    await this.wait(5000);
  }

  async checkForNoFlightsMessage() {
    try {
      // Check for "no flights available" message
      const noFlightsMessage = this.page.getByText(
        "متاسفانه، هیچ پروازی در این روز وجود ندارد"
      );
      if (await noFlightsMessage.isVisible({ timeout: 3000 })) {
        console.log("❌ No flights available for this date");
        await noFlightsMessage.click();
        return true; // No flights found
      }
    } catch (error) {
      // Message not found, continue
    }

    try {
      // Check for "notify me" message
      const notifyMessage = this.page.getByText(
        "به راحتی، از موجود شدن پرواز، باخبر شوید!موجود شد، خبرت می‌کنیم!"
      );
      if (await notifyMessage.isVisible({ timeout: 3000 })) {
        console.log(
          "📢 Notify me feature available - no flights currently available"
        );
        await notifyMessage.click();
        return true; // No flights found, but can notify
      }
    } catch (error) {
      // Message not found, continue
    }

    return false; // Flights should be available
  }

  async handleNotifyMeFeature() {
    try {
      const notifyButton = this.page.getByRole("button", {
        name: "موجود شد، خبرت می‌کنیم!",
      });
      if (await notifyButton.isVisible({ timeout: 3000 })) {
        console.log("🔔 Setting up flight notification...");
        await notifyButton.click();
        await this.wait(2000);

        const confirmButton = this.page.getByRole("button", { name: "تایید" });
        if (await confirmButton.isVisible({ timeout: 3000 })) {
          await confirmButton.click();
          console.log("✅ Flight notification set up successfully");
          return true; // Notification set up
        }
      }
    } catch (error) {
      console.log("⚠️ Could not set up notification");
    }

    return false; // Notification not set up
  }

  async selectFirstFlight() {
    try {
      const firstFlightButton = this.page
        .locator('[id^="accordion__heading-raa-"]')
        .first();
      await firstFlightButton.waitFor({ state: "visible", timeout: 10000 });

      await firstFlightButton
        .getByRole("button", { name: "انتخاب بلیط" })
        .click();
      console.log("✅ First flight selected successfully");
    } catch (error) {
      console.log(
        "⚠️ Could not find flight selection button, checking for timeout modal..."
      );

      // Check for timeout modal again
      const modalHandled = await this.checkTimeoutModal();
      if (modalHandled) {
        // Try again after refresh
        await this.page
          .getByRole("button", { name: "انتخاب بلیط" })
          .first()
          .click();
      } else {
        console.log("⚠️ No timeout modal found, trying direct approach...");
        // Alternative: look for any button with "انتخاب بلیط" text
        await this.page
          .getByRole("button", { name: "انتخاب بلیط" })
          .first()
          .click();
      }
    }
    await this.wait(5000);
  }

  async searchAndSelectFlight(origin = "تهران", destination = "مشهد") {
    console.log("✈️ Starting flight search process...");

    await this.selectOrigin(origin);
    await this.selectDestination(destination);
    await this.selectDepartureDate();
    await this.clickSearchButton();
    await this.waitForSearchResults();

    // Check for no flights messages
    const noFlights = await this.checkForNoFlightsMessage();
    if (noFlights) {
      console.log("📢 No flights available, trying notify me feature...");
      const notificationSet = await this.handleNotifyMeFeature();
      if (notificationSet) {
        console.log(
          "✅ Flight notification set up - test passed with notification"
        );
        return true; // Test passed with notification
      } else {
        throw new Error(
          "❌ No flights available and could not set up notification"
        );
      }
    }

    await this.selectFirstFlight();

    console.log("✅ Flight search and selection completed");
    return true; // Test passed with flight selection
  }
}

module.exports = FlightSearchPage;
