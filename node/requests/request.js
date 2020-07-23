const http = require('http');
const args = process.argv.slice(2);
const reqsNum = args[0];
const reqsType = args[1];

const params = {
    host: '127.0.0.1',
    port: 8081,
    method: 'GET'
};

if (reqsType === 's') {
    sendSequentialReqs(reqsNum).then(() => console.log(`${reqsNum} sequential reqs were sent`));
}
else if (reqsType === 'p') {
    sendParallelReqs(reqsNum).then(() => console.log(`${reqsNum} parallel reqs were sent`));
}
else {
    console.error('Wrong parameters.');
}

function sendGetReq(params) {
    return new Promise((resolve, reject) => {
        const req = http.request(params, (res) => {
            console.log("statusCode =", res.statusCode);
            if (res.statusCode !== 200) {
                return reject(new Error('statusCode =' + res.statusCode));
            }
            resolve();
        });
        req.on('error', (err) => reject(err));
        req.end();
    });
}

async function sendSequentialReqs(n) {
    for (let i = 0; i < n; i++) {
        await sendGetReq(params).then(null, (err) => console.log(err));
    }
}

async function sendParallelReqs(n) {
    let promises = [];
    for (let i = 0; i < n; i++) {
        promises.push(sendGetReq(params).then(null, (err) => console.log(err)));
    }
    await Promise.all(promises);
}
