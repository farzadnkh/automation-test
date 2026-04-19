// Test configuration for 780.ir automation
module.exports = {
  // Environment settings
  environment: {
    baseUrl: "https://stage-web.780.ir",
    apiUrl: "https://stage-api.780.ir",
    timeout: 300000, // 5 minutes
    waitTimeout: 2000, // 5 seconds between actions
  },

  // Test credentials
  credentials: {
    phoneNumber: "09148918991",
    nationalCode: "1363033379",
    otp: "123456", // Fixed OTP for stage environment
  },

  // Flight search settings
  flightSearch: {
    origin: "تهران",
    destination: "مشهد",
    departureDay: 17, // 17th of next month
  },

  // Passenger information
  passenger: {
    name: "فرزاد نیکرفتارخیابانی",
  },

  // Checkout settings
  checkout: {
    discountCode: "DmT1416",
    refundTerms: true, // Accept zero refund terms
    handleDiscountErrors: true, // Handle discount code errors
  },

  // Payment settings
  payment: {
    gateway: "درگاه پرداخت پارسیان",
    handlePriceChange: true,
  },

  // Error handling settings
  errorHandling: {
    checkTimeoutModal: true,
    checkInternalErrors: true,
    checkReservationErrors: true,
    handleNoFlights: true,
    setupNotification: true,
  },

  // Browser settings
  browser: {
    headless: false,
    slowMo: 0, // Delay between actions (ms)
    viewport: { width: 1280, height: 720 },
  },
};
