# Wdio File Reporter

Wdio File Reporter is a reporter that logs wdio test output to separate files based on locale, theme and form-factor with the following attributes

- date and time of when the tests are started and when they are finished

- Locale, Form Factor and Theme of the tests 

- Name of the tests and whether they've succeeded or failed

## Usage

Add WdioFileReporter as an additional reporter within the wdio.config file. Include "dot" to avoid overriding default reporters

```javascript

const WdioFileReporter = require('terra-toolkit/src/wdio/WdioFileReporter');
{
 reporters: ['dot', WdioFileReporter],
}

```
## Report Format
- The name of the log file will be **result-\<locale>-\<theme>-\<form-factor>.json**(eg: result-en-huge.json)
```
{
  "startDate": "4/29/2020, 2:24:35 PM",
  "type": "wdio",
  "locale": "en",
  "formFactor": "tiny",
  "theme": "default-theme",
  "Output": [
    [
      "------------------------------------------------------------------",
      "[chrome #0-0] Session ID: e0217cb2b64dc2598599c1b200b6e4ff",
      "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
      "[chrome #0-0] Running: chrome",
      "[chrome #0-0]",
      "[chrome #0-0] I18n Locale",
      "[chrome #0-0]   ✓ Express correctly sets the application locale",
      "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]",
      "[chrome #0-0] 2 passing (3s)",
      "[chrome #0-0]",
      "",
      ""
    ],
    [
      "------------------------------------------------------------------",
      "[chrome #0-1] Session ID: 3dd88eb199a63793bdcf220b92eef941",
      "[chrome #0-1] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/validateElement-spec.js",
      "[chrome #0-1] Running: chrome",
      "[chrome #0-1]",
      "[chrome #0-1] [tiny]",
      "[chrome #0-1]",
      "[chrome #0-1]     validateElement",
      "[chrome #0-1]",
      "[chrome #0-1]         full implementation",
      "[chrome #0-1]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-1]           ✓ checks element",
      "[chrome #0-1]",
      "[chrome #0-1]         inaccessible contrast",
      "[chrome #0-1]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-1]           ✓ checks element",
      "[chrome #0-1]",
      "[chrome #0-1]",
      "[chrome #0-1] 4 passing (5s)",
      "[chrome #0-1]",
      "",
      ""
    ],
    [
      "------------------------------------------------------------------",
      "[chrome #0-2] Session ID: dbb52821f6672ae497637b28be6c745f",
      "[chrome #0-2] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/hideInputCaret-spec.js",
      "[chrome #0-2] Running: chrome",
      "[chrome #0-2]",
      "[chrome #0-2] hideInputCaret",
      "[chrome #0-2]   ✓ validates the body's caret-color is transparent by default",
      "[chrome #0-2]   ✓ validates the textarea's caret-color is inherited as transparent",
      "[chrome #0-2]   ✓ validates the input's caret-color is inherited as transparent",
      "[chrome #0-2]   ✓ sets the input's caret-color to orange",
      "[chrome #0-2]   ✓ sets the input's caret-color back to transparent",
      "[chrome #0-2]   ✓ throws an error for a non-existent element",
      "[chrome #0-2]",
      "[chrome #0-2]",
      "[chrome #0-2] 6 passing (1s)",
      "[chrome #0-2]",
      "",
      ""
    ]
  ],
  "endDate": "4/29/2020, 2:24:57 PM"
}

```