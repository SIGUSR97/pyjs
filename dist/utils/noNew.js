"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nn = void 0;
function nn(cls) {
    return new Proxy(cls, {
        apply: (t, _, a) => new t(...a),
    });
}
exports.nn = nn;
