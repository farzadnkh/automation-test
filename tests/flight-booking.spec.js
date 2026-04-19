const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const FlightSearchPage = require("../pages/FlightSearchPage");
const PassengerInfoPage = require("../pages/PassengerInfoPage");
const CheckoutPage = require("../pages/CheckoutPage");

test("Complete flight booking flow", async ({ page }) => {
  // Set longer timeout (5 minutes)
  test.setTimeout(300000);

  // Initialize page objects
  const loginPage = new LoginPage(page);
  const flightSearchPage = new FlightSearchPage(page);
  const passengerInfoPage = new PassengerInfoPage(page);
  const checkoutPage = new CheckoutPage(page);

  try {
    // Step 1: Navigate to stage flight search page
    console.log("🌐 Navigating to stage environment...");
    const baseUrl = loginPage.config.environment.baseUrl;
    await loginPage.navigateTo(`${baseUrl}/tourism/flights`);
    await loginPage.reload();

    console.log("✅ Successfully navigated to flight search page");

    // Step 2: Perform login (using config defaults)
    await loginPage.performLogin();

    // Step 3: Search and select flight (using config defaults)
    const flightSearchResult = await flightSearchPage.searchAndSelectFlight();

    if (flightSearchResult === true) {
      // Flights available - continue with booking process
      console.log("✈️ Flights found, proceeding with booking...");

      // Step 4: Complete passenger information
      await passengerInfoPage.completePassengerInfo();

      // Step 5: Complete checkout process (using config default discount code)
      await checkoutPage.completeCheckout();

      console.log("🎉 Complete flight booking test passed successfully!");
    } else {
      // No flights available but notification was set up
      console.log(
        "📢 No flights available but notification was set up - test passed!"
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    await page.screenshot({
      path: `screenshots/test-failed-${Date.now()}.png`,
    });
    throw error;
  }
});
