"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const utilities_1 = require("./utilities");
const process_1 = require("process");
const qrcode_1 = __importDefault(require("qrcode"));
const utilities_2 = require("./utilities");
const server_1 = __importDefault(require("./server"));
const PORT = 2673;
const PROTOCOL = "http";
function default_1() {
    const server = http_1.default.createServer(server_1.default);
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