"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iter = exports.range = exports.zip = void 0;
const errors_1 = require("../errors");
function* zip(...iterables) {
    const iterators = iterables.map((it) => iter(it));
    while (iterators.length) {
        const result = [];
        for (const it of iterators) {
            const next = it.next();
            if (next.done)
                return;
            result.push(next.value);
        }
        yield result;
    }
}
exports.zip = zip;
function* range(...args) {
    let [start, end, step = 1] = args;
    if (end === void 0)
        [end, start] = [start, 0];
    for (const n of [start, end, step])
        if (!Number.isInteger(n))
            throw new TypeError(`'${n}' cannot be interpreted as an integer`);
    if (step === 0)
        throw new errors_1.ValueError('range() arg 3 must not be zero');
    let return_;
    if (step > 0)
        return_ = (x) => x >= end;
    else
        return_ = (x) => x <= end;
    while (true) {
        if (return_(start))
            return;
        yield start;
        start += step;
    }
}
exports.range = range;
function iter(iterable) {
    if (typeof iterable.next === 'function')
        return iterable;
    if (typeof iterable[Symbol.iterator] === 'function')
        return iterable[Symbol.iterator]();
    throw new TypeError(`'${typeof iterable}' object is not iterable`);
}
exports.iter = iter;
exports.default = { zip, range, iter };
