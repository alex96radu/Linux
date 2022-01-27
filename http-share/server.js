"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const mime_types_1 = __importDefault(require("mime-types"));
const files = fs_1.default.readdirSync('.');
function serveSumary(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    const list = files.map((file) => `<li><a href="${file}">${file}</a></li>`).join("");
    res.write(`<ul>${list}</ul>`);
    res.end();
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
function serve(req, res) {
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
exports.default = serve;
//# sourceMappingURL=server.js.map