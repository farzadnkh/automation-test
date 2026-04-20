// Test configuration for flight-booking automation.
// IMPORTANT: do not commit real credentials. Use environment variables or CI secrets.
const env = process.env;

module.exports = {
  environment: {
    baseUrl: env.BASE_URL || "https://stage-web.example.com",
    apiUrl: env.API_URL || "https://stage-api.example.com",
    timeout: Number(env.TEST_TIMEOUT_MS || 300000),
    waitTimeout: Number(env.WAIT_TIMEOUT_MS || 2000),
  },

  credentials: {
    phoneNumber: env.TEST_PHONE_NUMBER || "00000000000",
    nationalCode: env.TEST_NATIONAL_CODE || "0000000000",
    otp: env.TEST_OTP || "000000",
  },

  flightSearch: {
    origin: env.FLIGHT_ORIGIN || "تهران",
    destination: env.FLIGHT_DESTINATION || "مشهد",
    departureDay: Number(env.FLIGHT_DEPARTURE_DAY || 17),
  },

  passenger: {
    name: env.TEST_PASSENGER_NAME || "Test Passenger",
  },

  checkout: {
    discountCode: env.TEST_DISCOUNT_CODE || "",
    refundTerms: true,
    handleDiscountErrors: true,
  },

  payment: {
    gateway: env.PAYMENT_GATEWAY || "Generic Payment Gateway",
    handlePriceChange: true,
  },

  errorHandling: {
    checkTimeoutModal: true,
    checkInternalErrors: true,
    checkReservationErrors: true,
    handleNoFlights: true,
    setupNotification: true,
  },

  browser: {
    headless: env.HEADLESS === "true" ? true : false,
    slowMo: Number(env.SLOW_MO_MS || 0),
    viewport: { width: 1280, height: 720 },
  },
};
