const fs = require('fs');

const fileSizeLimitMB = 100;
const numberRangeMin = 1;
const numberRangeMax = 999999;
const partLength = 1000;

const calcFileSizeMB = (fileName) => (fs.statSync(fileName)['size'] / Math.pow(1024, 2)).toFixed(2);

module.exports = function create(fileName) {
    console.log(`Start createing file ${fileName}...`);
    if (fs.existsSync(fileName))
        fs.unlink(fileName, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }
        });
    do {
        let numbers = Array.from({length: partLength}, () =>  Math.floor(numberRangeMin + Math.random() * (numberRangeMax - numberRangeMin + 1)));
        fs.appendFileSync(fileName, numbers.join("\n"), (err) => {
            if (err) {
                console.error(err);
                throw err;
            }
        });
    }
    while (calcFileSizeMB(fileName) < fileSizeLimitMB);
    console.log(`The file ${fileName} was created. Final file size: ${calcFileSizeMB(fileName)}MB`);
}
