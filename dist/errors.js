"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueError = exports.KeyError = exports.IndexError = void 0;
class IndexError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'IndexError';
    }
}
exports.IndexError = IndexError;
class KeyError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'KeyError';
    }
}
exports.KeyError = KeyError;
class ValueError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'ValueError';
    }
}
exports.ValueError = ValueError;
