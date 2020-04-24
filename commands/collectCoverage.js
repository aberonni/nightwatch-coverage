/**
 * Extracts the __coverage__ object from a web page with istanbul-instrumented code
 * and adds the extracted data to the coverage map
 *
 * @function
 * @param {function} [callback] - The callback function that will be called once the contents of the __coverage object has been added to the coverage map
 * @returns {browser}
 */
module.exports.command = function (callback) {
    const browser = this;
    
    const { coverageVariable, parseCoverageData } = browser.globals.coverageReporter.options;
    
    browser.execute(
        function (cov) {
            // eslint-disable-next-line no-undef
            return window[cov];
        },
        [coverageVariable],
        function (response) {
            if (response.status !== 0 || !response.value) {
                console.log(response);
                throw new Error(
                    'An error occurred while gathering coverage information'
                );
            }

            let coverageData = parseCoverageData(response.value);
            browser.globals.coverageReporter.coverageMap.merge(coverageData);
            callback();
        }
    );

    return this;
};
