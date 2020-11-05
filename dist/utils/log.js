"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logComplete = void 0;
const util = require('util');
function logComplete(...args) {
    console.log(...args.map((arg) => util.inspect(arg, { showHidden: true, depth: null })));
}
exports.logComplete = logComplete;
;
