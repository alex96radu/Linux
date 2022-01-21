"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validInterface = exports.concatenateOnSameLine = void 0;
const os_1 = require("os");
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
exports.concatenateOnSameLine = concatenateOnSameLine;
const interfaces = (0, os_1.networkInterfaces)();
exports.validInterface = Object.keys(interfaces)
    .map((key) => interfaces[key])
    .filter(n => n !== undefined)
    .map(n => n)
    .reduce((res, arr) => {
    return [...res, ...arr];
}, [])
    .filter((n) => n.family == 'IPv4')
    .find((n) => !n.internal);
//# sourceMappingURL=utilities.js.map