// Using a "broadband" connection type
// Corresponds to "Dense 4G 25th percentile" in https://docs.google.com/document/d/1Ft1Bnq9-t4jK5egLSOc28IL4TvR-Tt0se_1faTA4KTY/edit#heading=h.bb7nfy2x9e5v
const { desktopDense4G } = require('lighthouse/lighthouse-core/config/constants.js').throttling;

const lighthouseConfig = (isMobileDevice) => ({
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    useThrottling: true,
    recordTrace: true,
    emulatedFormFactor: (isMobileDevice) ? 'mobile' : 'desktop',
    throttling: desktopDense4G,
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    skipAudits: ['uses-http2'],
  },
});

module.exports = lighthouseConfig;
