"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const os_1 = require("os");
const process_1 = require("process");
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const PORT = 2673;
const PROTOCOL = "http";
function concatenateOnSameLine(s1, s2 = []) {
    const size = Math.max(s1.length, s2.length);
    const res = [];
    for (let i = 0; i < size; ++i) {
        if (i < s1.length && i < s2.length) {
            res[i] = s1[i] + s2[i];
        }
        else if (i < s1.length) {
            res[i] = s1[i];
        }
        else {
            res[i] = s1[i];
        }
    }
    return res;
}
const files = fs_1.default.readdirSync('.');
function serveSumary(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    const list = files.map((file) => `<li><a href="${file}">${file}</a></li>`).join("");
    res.end(`<ul>${list}</ul>`);
}
function serveFile(req, res) {
    const name = req.url?.substring(1);
    const file = files.find(f => f === name);
    if (!file) {
        res.writeHead(404);
        res.end();
        return;
    }
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
    if (!req.url || req.url == '/') {
        serveSumary(req, res);
        return;
    }
    serveFile(req, res);
}
function default_1() {
    const server = http_1.default.createServer(request);
    server.listen(PORT);
    const interfaces = (0, os_1.networkInterfaces)();
    const valid = Object.keys(interfaces)
        .map((key) => interfaces[key])
        .filter(n => n !== undefined)
        .map(n => n)
        .reduce((res, arr) => {
        return [...res, ...arr];
    }, [])
        .filter((n) => n.family == 'IPv4')
        .find((n) => !n.internal);
    if (valid) {
        const url = `${PROTOCOL}://${valid.address}:${PORT}`;
        let info = [
            `Protocol: ${PROTOCOL}`,
            `Port: ${PORT}`,
            `Adress: ${valid.address}`,
            `Url: ${url}`
        ];
        info = info.reduce((res, s) => {
            return [...res, "", `\t${s}`];
        }, []);
        qrcode_1.default.toString(url, { type: 'terminal' }, (error, qrStr) => {
            process_1.stdout.write(concatenateOnSameLine(qrStr.split("\n"), info).join('\n'));
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=main.js.map