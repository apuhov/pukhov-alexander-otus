const fs = require('fs');
const readline = require('readline');
const createFile = require('./createFile');
const inputFileName = 'input.txt';
const outFileName = 'result.txt';
const partFileSizeMB = 5;

const calcFileSizeMB = (fileName) => (fs.statSync(fileName)['size'] / Math.pow(1024, 2)).toFixed(2);

main();

async function main() {
    if (!fs.existsSync(inputFileName)) {
        createFile(inputFileName);
    }
    console.log(`Start splitting the file ${inputFileName}...`);
    let partFileNames = await splitFiles();
    console.log('The file was split. Start merging and sorting...');
    const streams = await createPartStreams(partFileNames);
    const buffers = await Promise.all(streams.map(it => it.next()));
    const outStream = fs.createWriteStream(outFileName);
    async function writeToOutput() {
        while (buffers.length > 0) {
            let idxMin = buffers.findIndex(b => b.value === Math.min(...buffers.map(b => b.value)));
            let canContinue = outStream.write(`${buffers[idxMin].value}\n`);
            buffers[idxMin] = await streams[idxMin].next();
            if (buffers[idxMin].done) {
                buffers.splice(idxMin, 1);
                streams.splice(idxMin, 1);
            }
            if  (!canContinue) {
                outStream.once('drain', writeToOutput);
                return;
            }
        }
        outStream.end();
        await deleteFiles(partFileNames);
        console.log(`The end of the sorting. Sorted file: ${outFileName}`)
    }
    await writeToOutput();
}

async function deleteFiles(files) {
    return new Promise((res, rej) => {
        for (let fileName of files) {
            fs.unlink(fileName, (err) => {
                if (err) {
                    console.error(err);
                    rej(err);
                }
            });
        }
        res();
    });
}

const calcSizeOfNumbersArrayMB = (arr) => arr.length*7/Math.pow(1024, 2);
async function splitFiles() {
    return new Promise((res) => {
        const partFileNames = [];
        const rl = readline.createInterface({input: fs.createReadStream(inputFileName), terminal: false});
        const lines = [];
        let partNumber = 0;
        rl.on('line', function (line) {
            lines.push(line);
            if (calcSizeOfNumbersArrayMB(lines) > partFileSizeMB) {
                partFileNames.push(createPartFile(lines, partNumber));
                partNumber++;
            }
        });
        rl.on('close', function () {
            partFileNames.push(createPartFile(lines, partNumber));
            console.log(`${inputFileName} stream close`);
            res(partFileNames);
        });
    });
}

function createPartFile(lines, partNumber) {
    let partFileName = `part_${partNumber}.txt`;
    lines.sort((a, b) => a - b);
    fs.writeFileSync(partFileName, lines.join("\n"));
    console.log(`The file ${partFileName} was created. File size: ${calcFileSizeMB(partFileName)}MB`);
    lines.length = 0;
    return partFileName;
}

function createPartStreams (tmpFiles) {
    return tmpFiles
        .map(fileName => fs.createReadStream(fileName))
        .map(stream => streamToNumbers(stream))
}

async function* streamToNumbers(stream) {
    let previous = '';
    for await (const part of stream) {
        previous += part;
        let eolIndex;
        while ((eolIndex = previous.indexOf('\n')) >= 0) {
            const line = previous.slice(0, eolIndex+1);
            yield parseInt(line);
            previous = previous.slice(eolIndex+1);
        }
    }
    if (previous.length > 0) {
        yield parseInt(previous);
    }
}
