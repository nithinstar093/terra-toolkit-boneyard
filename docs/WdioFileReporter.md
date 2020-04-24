# Wdio File Reporter

  

Wdio File Reporter is a reporter that logs jest test output to a file

  

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

=======================================
Start Date: 4/23/2020, 6:15:36 PM
------------------------------------------------------------------
[chrome #0-0] Session ID: 01d96af9cb6dc50caeb2cfd99e0fa435
[chrome #0-0] Spec: /opt/module/tests/wdio/axe-spec.js
[chrome #0-0] Running: chrome
[chrome #0-0]
[chrome #0-0] axe
[chrome #0-0]   ✓ checks accessibility
[chrome #0-0]   ✓ checks inaccessibility
[chrome #0-0]   ✓ ignores inaccessibility based on test rules
[chrome #0-0]   ✓ ignores inaccessibility based on global rules
[chrome #0-0]   ✓ ignores inaccessibility based on merged rules
[chrome #0-0]
[chrome #0-0]
[chrome #0-0] 5 passing (4s)
[chrome #0-0]

------------------------------------------------------------------
[chrome #0-1] Session ID: 8891d0a556609ab49f70315481b5130f
[chrome #0-1] Spec: /opt/module/tests/wdio/beAccessible-spec.js
[chrome #0-1] Running: chrome
[chrome #0-1]
[chrome #0-1] beAccessible
[chrome #0-1]
[chrome #0-1]     accessible
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast - test rules
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1] beAccessible with looping
[chrome #0-1]
[chrome #0-1]     accessible
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast - global rules
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast - Merged rules
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1] beAccessible with looping
[chrome #0-1]
[chrome #0-1]     accessible
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast - global rules
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]     inaccessible contrast - Merged rules
[chrome #0-1]       ✓ is accessible
[chrome #0-1]
[chrome #0-1]
[chrome #0-1] 10 passing (4s)
[chrome #0-1]

------------------------------------------------------------------
[chrome #0-2] Session ID: f3d4a1f5948b5c39237eb643c84b3075
[chrome #0-2] Spec: /opt/module/tests/wdio/compare-spec.js
[chrome #0-2] Running: chrome
[chrome #0-2]
[chrome #0-2] comparing screenshots
[chrome #0-2]   ✓ [0] checks visual comparison with shortened id
[chrome #0-2]   ✓ checks visual comparison with a [tag]
[chrome #0-2]   ✓ checks visual comparison on document level
[chrome #0-2]
[chrome #0-2]
[chrome #0-2] 3 passing (6s)
[chrome #0-2]

==================================================================
Number of specs: 8

End Date: 4/23/2020, 6:18:24 PM
```