const http = require('http');
const { resolveSoa } = require('dns');
const port = 8081;
const timeout = 100;

const requestHandler = (request, response) => {
    setTimeout(() => {
        response.statusCode = 200;
        response.end();
    }, timeout);
}

const server = http.createServer(requestHandler);
server.listen(port, "localhost", (err) => {
    if (err) {
        return console.log('err: ', err);
    }
    console.log(`server is listening on ${port}`);
})