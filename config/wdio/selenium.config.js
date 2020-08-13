const http = require("http");
const edge = require("@microsoft/edge-selenium-tools");

// Launch Microsoft Edge (Chromium)
let options = new edge.Options().setEdgeChromium(true);
console.log("options: ", options);


const chromeConfig = {
  browserName: "chrome",
  maxInstances: 1,
  loggingPrefs: {
    performance: "ALL",
  },
  "goog:chromeOptions": {
    /** Run in headless mode since Chrome 69 cannot reach the tiny viewport size due to a omnibox size changexx
     * made by the chrome team. See https://bugs.chromium.org/p/chromedriver/issues/detail?id=2626#c1 &&
     * https://bugs.chromium.org/p/chromium/issues/detail?id=849784.
     */
    args: ["headless", "disable-gpu"],
    perfLoggingPrefs: {
      traceCategories:
        "blink.console, devtools.timeline, toplevel, disabled-by-default-devtools.timeline, disabled-by-default-devtools.timeline.frame",
    },
  },
};

const firefoxConfig = {
  browserName: "firefox",
  maxInstances: 1,
  "moz:firefoxOptions": {
    prefs: {
      "dom.disable_beforeunload": false,
    },
  },
};

const ieConfig = {
  browserName: "internet explorer",
  maxInstances: 1,
  /** IE Driver custom capabilities must be passed as a sub-object specified under 'se:ieOptions' key for
   * version ^3.3.0.1. and Webdriver.io does not pass these as a sub-options.
   * See https://github.com/SeleniumHQ/selenium/blob/master/cpp/iedriverserver/CHANGELOG#L782.
   */
  "se:ieOptions": {
    javascriptEnabled: true,
    locationContextEnabled: true,
    handlesAlerts: true,
    rotatable: true,
  },
};

const edgeConfig = {
  // browserName: 'edge chromium',
  // maxInstances: 1,
  // version: '84.0.522.49',
  //----------------------
  browserName: 'MicrosoftEdge',
  version: '84.0.522.59',
  maxInstances: 1,
  ...options
  // nativeEvents: false,
  // browserName: 'msedgedriver',
  // version: '84.0.522.59',
  // platform: 'ANY',
  // javascriptEnabled: true,
  // takesScreenshot: true,
  // handlesAlerts: true,
  // databaseEnabled: true,
  // locationContextEnabled: true,
  // applicationCacheEnabled: false,
  // browserConnectionEnabled: true,
  // cssSelectorsEnabled: true,
  // webStorageEnabled: true,
  // rotatable: true,
};

//const edgeConfig = options;

const determineCapabilities = ({ useSeleniumGrid, browsers }) => {
  const capabilities = [edgeConfig];

  // if (!browsers) {
  //   // always test chrome by default
  //   capabilities.push(chromeConfig);

  //   // always test chrome, firefox and IE by default when selenium grid url is provided
  //   if (useSeleniumGrid) {
  //     capabilities.push(edgeConfig);
  //   }
  // } else {
  //   if (browsers.includes("chrome")) {
  //     capabilities.push(chromeConfig);
  //   }
  //   if (browsers.includes("firefox")) {
  //     capabilities.push(firefoxConfig);
  //   }
  //   if (useSeleniumGrid && browsers.includes("ie")) {
  //     capabilities.push(ieConfig);
  //   }
  //   if (useSeleniumGrid && browsers.includes("edge")) {
  //     capabilities.push(edgeConfig);
  //   }
  // }
  /* Randomized the browser order to reduce a heavy number of session request made to the grid for each browser at once. */
  return capabilities.sort(() => 0.5 - Math.random());
};

const determineConfig = (envs) => {
  const { ci, seleniumGridUrl, browsers } = envs;

  const useSeleniumGrid = seleniumGridUrl !== undefined;

  const config = {
    seleniumVersion: "3.14",
    maxInstances: 1,
    seleniumDocker: {
      // enabled: !(ci || useSeleniumGrid),
      enabled: false
    },
    capabilities: determineCapabilities({ useSeleniumGrid, browsers }),
  };

  if (useSeleniumGrid) {
    config.host = seleniumGridUrl;
    config.port = "80";
    config.path = "/wd/hub";
    config.agent = new http.Agent({ keepAlive: true, timeout: 600000 });
  }

  if (ci) {
    config.host = "standalone-chrome";
  }
  config.host = 'localhost';
  config.port = '9515';
  config.path = '';

  return config;
};

exports.determineConfig = determineConfig;
