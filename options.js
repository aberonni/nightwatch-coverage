const path = require('path');

module.exports = {
    coverageDirectory: path.join(process.cwd(), 'coverage'),
    coverageReporters: ['html', 'json'],
    coverageVariable: '__coverage__',
    parseCoverageData: function (coverageData) { return coverageData; },
};
