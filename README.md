# 780.ir Flight Booking Automation Test

Complete end-to-end automation test for flight booking on 780.ir stage environment using Page Object Model design pattern.

## Features

- ✅ **Page Object Model**: Clean, maintainable code structure
- ✅ **Complete Booking Flow**: Login → Search → Select → Passenger Info → Checkout → Payment
- ✅ **Smart Error Handling**: Automatic timeout modal detection and refresh
- ✅ **Price Change Handling**: Handles price change modals during checkout
- ✅ **Error Detection**: Detects and fails on internal errors and reservation issues
- ✅ **No Flights Handling**: Handles scenarios when no flights are available
- ✅ **Notification Feature**: Sets up flight notifications when flights are not available
- ✅ **Comprehensive Assertions**: Validates each step with proper assertions
- ✅ **Stage Environment**: Configured for `stage-web.780.ir` with fixed credentials
- ✅ **Modular Design**: Separate page classes for each functionality

## Setup

```bash
# Install dependencies
npm install
npx playwright install
```

## Running Tests

```bash
# Run POM test with visible browser (recommended)
npm run test:headed

# Run POM test in headless mode
npm run test

# Run POM test in debug mode
npm run test:debug

# Run with specific browser
npm run test:chromium:headed

# Run simple test (original)
npm run test:simple

# Run all tests
npm run test:all
```

## Test Flow

1. **Navigation**: Go to stage flight search page
2. **Authentication**: Login with fixed credentials:
   - Phone: `09148918991`
   - National Code: `1363033379`
   - OTP: `123456` (fixed for stage)
3. **Flight Search**: Search for flights (Tehran to Mashhad)
4. **Flight Selection**: Select first available flight
5. **Passenger Info**: Complete passenger information
6. **Checkout Process**:
   - Accept zero refund terms (استرداد بدون جریمه)
   - Apply discount code `DmT1416`
   - Handle price change modals if they appear
7. **Payment**: Proceed to payment gateway (درگاه پرداخت پارسیان)

## Error Handling

- **Timeout Modals**: Automatically detects and refreshes when timeout occurs
- **Price Changes**: Handles price change notifications during checkout
- **Internal Errors**: Fails test if internal errors occur
- **Reservation Errors**: Fails test if reservation process fails
- **No Flights Available**: Handles scenarios when no flights are found
- **Flight Notifications**: Sets up notifications when flights are not available

## Project Structure

```
780-automation-test/
├── config/                         # Configuration files
│   └── test-config.js             # Test configuration and settings
├── pages/                          # Page Object Model classes
│   ├── BasePage.js                 # Base page with common functionality
│   ├── LoginPage.js                # Authentication and login
│   ├── FlightSearchPage.js         # Flight search and selection
│   ├── PassengerInfoPage.js        # Passenger information
│   └── CheckoutPage.js             # Checkout and payment
├── tests/                          # Test files
│   └── flight-booking.spec.js      # Main test
├── package.json                    # Dependencies and scripts
├── playwright.config.js            # Playwright configuration
└── README.md                       # This documentation
```

## Files

- `config/test-config.js` - Test configuration and settings
- `tests/flight-booking.spec.js` - Main test file
- `pages/` - Page Object Model classes
- `package.json` - Dependencies and scripts
- `playwright.config.js` - Playwright configuration for stage environment
- `README.md` - This documentation

## Configuration

The test is configured for the **stage environment** via `config/test-config.js`:

### Environment Settings

- **Base URL**: `https://stage-web.780.ir`
- **API URL**: `https://stage-api.780.ir`
- **Timeout**: 5 minutes for complex operations
- **Wait Timeout**: 5 seconds between actions

### Test Credentials

- **Phone Number**: `09148918991`
- **National Code**: `1363033379`
- **OTP**: `123456` (fixed for stage environment)

### Flight Search Settings

- **Origin**: تهران
- **Destination**: مشهد
- **Departure Date**: 17th of next month

### Checkout Settings

- **Discount Code**: `DmT1416`
- **Refund Terms**: Accept zero refund terms
- **Discount Error Handling**: Handles invalid/expired discount codes

### Error Handling

- Automatic timeout modal detection and refresh
- Internal error detection
- Reservation error detection
- No flights handling with notification setup
- Discount code error handling (invalid/expired codes)
