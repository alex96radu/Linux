"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const utilities_1 = require("./utilities");
const process_1 = require("process");
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const utilities_2 = require("./utilities");
const PORT = 2673;
const PROTOCOL = "http";
const files = fs_1.default.readdirSync('.');
function serveSumary(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    const list = files.map((file) => `<li><a href="${file}">${file}</a></li>`).join("");
    res.end(`<ul>${list}</ul>`);
}
function serveFile(req, res, file) {
    const mimeType = mime_types_1.default.contentType(path_1.default.extname(file));
    if (mimeType) {
        res.setHeader("Content-Type", mimeType);
    }
    const { size } = fs_1.default.statSync(file);
    let [x, y] = req.headers.range?.replace("bytes=", "").split("-") ?? ['0', '0'];
    let end = parseInt(y) || size - 1;
    let start = parseInt(x) || 0;
    if (start >= size || end >= size) {
        res.setHeader("Content-Range", `bytes */${size}`);
        res.writeHead(416);
        return res.end();
    }
    res.setHeader("Content-Length", end - start + 1);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Accept-Ranges", "bytes");
    res.writeHead(200);
    const stream = fs_1.default.createReadStream(file, {
        start,
        end
    });
    stream.pipe(res);
}
function request(req, res) {
    if (process_1.argv.length >= 3) {
        serveFile(req, res, process_1.argv[2]);
        return;
    }
    if (!req.url || req.url == '/') {
        serveSumary(req, res);
        return;
    }
    let name = req.url?.substring(1);
    if (!name) {
        res.writeHead(404);
        res.end();
        return;
    }
    name = decodeURI(name);
    const file = files.find(f => f === name);
    if (!file) {
        res.writeHead(404);
        res.end();
        return;
    }
    serveFile(req, res, name);
}
function default_1() {
    const server = http_1.default.createServer(request);
    server.listen(PORT);
    if (utilities_1.validInterface) {
        const url = `${PROTOCOL}://${utilities_1.validInterface.address}:${PORT}`;
        let info = [
            `Protocol: ${PROTOCOL}`,
            `Port: ${PORT}`,
            `Adress: ${utilities_1.validInterface.address}`,
            `Url: ${url}`
        ];
        info = info.reduce((res, s) => {
            return [...res, "", `\t${s}`];
        }, []);
        qrcode_1.default.toString(url, { type: 'terminal' }, (error, qrStr) => {
            process_1.stdout.write((0, utilities_2.concatenateOnSameLine)(qrStr.split("\n"), info).join('\n'));
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=main.js.map