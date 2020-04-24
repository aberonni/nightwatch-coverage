const { createReporter } = require('istanbul-api');
const { createCoverageMap } = require('istanbul-lib-coverage');

const defaultOptions = require('./options');

class NightwatchCoverageReporter {
    constructor (options) {
        this.options = options;
        this.coverageMap = createCoverageMap({});
        this.reporter = createReporter();
    }

    save() {
        const { coverageDirectory, coverageReporters } = this.options;
        this.reporter.dir = coverageDirectory;
        this.reporter.addAll(coverageReporters);
        this.reporter.write(this.coverageMap);
    }
}

module.exports = {
    createCoverageReporter(options) {
        return new NightwatchCoverageReporter({
            ...defaultOptions,
            ...options,
        });
    }
};
