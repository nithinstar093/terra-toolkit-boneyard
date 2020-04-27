# Wdio File Reporter

  

Wdio File Reporter is a reporter that logs wdio test output to a file

  

- This Reporter will shows us date/time of when the tests are started and when they are finished

  

- Name of the tests and whether they've succeeded or failed

  

**We are gonna use spec-reporter which helps in displaying individual test results with the test suite hierarchy (https://webdriver.io/docs/spec-reporter.html)**

  

## Configuration for Spec Reporter

  

Add Costume reporter in the wdio.config file so that wdio knows what reporter to use when outputting the test results.

  

**Modifications in the wdio.config.js file**

  

Add spec as a reporter 

  

```javascript

reporters: ['dot', 'spec'],

```

  

This will use custom reporter in addition to default reporters that Wdio uses.

  

```javascript

{
 reporters: ['dot', 'spec', WdioFileReporter],
}

```

  

**This is how the generated log file looks**
```
{
  "1bc5eee618183f0b4c7c142653650e45": [
    {
      "startDate": "4/27/2020, 10:50:51 AM",
      "type": "wdio",
      "theme": "default-theme",
      "locale": "en",
      "formFactor": "tiny",
      "result": [
        "------------------------------------------------------------------",
        "[chrome #0-0] Session ID: eb1a741399afd9e49117c3fb99f35da0",
        "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
        "[chrome #0-0] Running: chrome",
        "[chrome #0-0]",
        "[chrome #0-0] I18n Locale",
        "[chrome #0-0]   ✓ Express correctly sets the application locale",
        "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
        "[chrome #0-0]",
        "[chrome #0-0]",
        "[chrome #0-0] 2 passing (2s)",
        "[chrome #0-0]",
        ""
      ],
      "endDate": "4/27/2020, 10:51:11 AM"
    },
    {
      "startDate": "4/27/2020, 10:51:15 AM",
      "type": "wdio",
      "theme": "default-theme",
      "locale": "en",
      "formFactor": "huge",
      "result": [
        "------------------------------------------------------------------",
        "[chrome #0-0] Session ID: 3cff60e21589db20f8a909aee6465687",
        "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
        "[chrome #0-0] Running: chrome",
        "[chrome #0-0]",
        "[chrome #0-0] I18n Locale",
        "[chrome #0-0]   ✓ Express correctly sets the application locale",
        "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
        "[chrome #0-0]",
        "[chrome #0-0]",
        "[chrome #0-0] 2 passing (2s)",
        "[chrome #0-0]",
        ""
      ],
      "endDate": "4/27/2020, 10:51:39 AM"
    },
    {
      "startDate": "4/27/2020, 10:51:43 AM",
      "type": "wdio",
      "theme": "default-theme",
      "locale": "fr",
      "formFactor": "tiny",
      "result": [
        "------------------------------------------------------------------",
        "[chrome #0-0] Session ID: 2e99dd016d4c41c0bffce36fd40c8981",
        "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
        "[chrome #0-0] Running: chrome",
        "[chrome #0-0]",
        "[chrome #0-0] I18n Locale",
        "[chrome #0-0]   ✓ Express correctly sets the application locale",
        "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
        "[chrome #0-0]",
        "[chrome #0-0]",
        "[chrome #0-0] 2 passing (2s)",
        "[chrome #0-0]",
        ""
      ],
      "endDate": "4/27/2020, 10:52:06 AM"
    },
    {
      "startDate": "4/27/2020, 10:52:10 AM",
      "type": "wdio",
      "theme": "default-theme",
      "locale": "fr",
      "formFactor": "huge",
      "result": [
        "------------------------------------------------------------------",
        "[chrome #0-0] Session ID: 47f7e10bf4996b88e8c56109ee63c0f4",
        "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
        "[chrome #0-0] Running: chrome",
        "[chrome #0-0]",
        "[chrome #0-0] I18n Locale",
        "[chrome #0-0]   ✓ Express correctly sets the application locale",
        "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
        "[chrome #0-0]",
        "[chrome #0-0]",
        "[chrome #0-0] 2 passing (2s)",
        "[chrome #0-0]",
        ""
      ],
      "endDate": "4/27/2020, 10:52:33 AM"
    }
  ],
}

```