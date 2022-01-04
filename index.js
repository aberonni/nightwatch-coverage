const fs = require('fs');
const path = require('path');
const mkdirp = require('make-dir');
const { v4: uuidv4 } = require('uuid');

const {createCoverageMap} = require('istanbul-lib-coverage');

const defaultOptions = require('./options');

class NightwatchCoverageReporter {
    constructor(options) {
        this.options = options;
        this.coverageMap = createCoverageMap({});
    }

    save() {
        const {coverageDirectory} = this.options;
        mkdirp.sync(coverageDirectory);
        const id = uuidv4(); // must be unique per test suite
        const coverageFilename = path.resolve(coverageDirectory, id + '.json');
        fs.writeFileSync(
            coverageFilename,
            JSON.stringify(this.coverageMap.toJSON()),
            'utf-8'
        );
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
