const path = require('path');

module.exports = {
    coverageDirectory: path.join(process.cwd(), '.nyc_output'),
    coverageVariable: '__coverage__',
    parseCoverageData: function (coverageData) { return coverageData; },
};
