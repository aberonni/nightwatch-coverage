# nightwatch-coverage

Coverage collection utility for [nightwatch.js](https://nightwatchjs.org/)

Inspired by [munkyjunky's gist][https://gist.github.com/munkyjunky/7c55bafa2f11ba4c72d79a5ef314127b]

## Setup

Before using this module, you must be running tests on instrumented code. This module does not do that for you.

There are a few ways for you to do that:
- [Instrument code using nyc](https://github.com/istanbuljs/nyc/blob/master/docs/instrument.md)
- [Instrument code using babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul)
- [Instrument code using istanbul-lib-instrument directly](https://www.npmjs.com/package/istanbul-lib-instrument)

Once you have successfully instrumented your code, you should have a `window.__coverage__` object available in the global scope of your website. This is the object that contains all coverage information for your website, and it is what this module will use to measure coverage.

## Installation

```bash
npm i nightwatch-coverage --save-dev
# OR
yarn add nightwatch-coverage -D
```

## Usage

#### 1. Register nightwatch-coverage custom commands

```js
// nightwatch.config.js
module.exports = {
    custom_commands_path: [
        'your/custom/commands',
        'node_modules/nightwatch-coverage/commands',
    ]
}
```

#### 2. Configure and add the coverageReporter to your globals file

```js
// globals.js
const { createCoverageReporter } = require('nightwatch-coverage');

const coverageReporter = createCoverageReporter({/* options */});

module.exports = {
    coverageReporter, // this needs to be added to your globals so that the custom command can access it
    after(done) {
        coverageReporter.save(); // call this function in your global after hook 
        done();
    },
}
```

See more about configuring the coverage reporter in the [options section](#options).

#### 3. Collect coverage

Call `collectCoverage` whenever you want to collect coverage.

You can do this in an `afterEach` hook:

```js
// globals.js
module.exports = {
    afterEach(browser, done) {
        // this will not work if you call `client.end` in your test
        browser.collectCoverage(function () {
            client.end(done);
        });
    },
}
```

Or you can do this directly in your test:

```js
module.exports = {
    'My test'(browser) {
        browser
            .waitForElementVisible('button')
            .click('button')
            .collectCoverage();
    }
}
```

## Options

The `createCoverageReporter` function accepts an object with the following options. For information on the defaults you can check [options.js](/options.js)

| name | type | description |
| - | - | - |
| coverageDirectory | string | Directory in which to save the coverage report |
| coverageReporters | array | A list of desired [reporter formats](https://istanbul.js.org/docs/advanced/alternative-reporters/) |
| coverageVariable | string | The variable containing the coverage data that should be extracted from the website |
| parseCoverageData | function | A function to parse/clean/filter the coverage data extracted from the website |

## Known limitations

#### Does not work with tests running in parallel

Because of the way we store coverage data in globals between test runs, there is no way to access that data in the global `after` hook when running tests in parallel. I could not find a way to workaround this limitation.

#### Issues with page change/refresh

If you only use the custom command inside the global `afterEach` hook, and there is a page refresh/change inside the test case, then the coverage from anything before that refresh/change is not collected.

This can be mitigated by collecting coverage also within the test cases themselves, before triggering the page refresh/change.
