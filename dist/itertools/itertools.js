"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = __importDefault(require("../operator"));
const builtins_1 = require("../builtins");
const errors_1 = require("../errors");
const utils_1 = require("../utils/utils");
function* _emptyGen(...args) { }
function* _identityGen(val) {
    yield val;
}
function* count(start = 0, step = 1) {
    yield start;
    while (true)
        yield ((start += step), start);
}
function* cycle(iterable) {
    const saved = [];
    for (const i of iterable)
        yield (saved.push(i), i);
    while (true)
        for (const i of saved)
            yield i;
}
function* repeat(obj, times = Infinity) {
    for (let i = 0; i < times; ++i)
        yield obj;
}
function* accumulate(iterable, func = operator_1.default.add, initial) {
    const it = builtins_1.iter(iterable);
    let total = initial;
    if (initial === void 0) {
        const next = it.next();
        if (next.done)
            return;
        total = next.value;
    }
    yield total;
    for (const el of it) {
        yield (total = func(total, el));
    }
}
function* chain(...iterables) {
    for (const it of iterables)
        yield* it;
}
chain.fromIterable = chain.from_iterable = function (iterables) {
    return this.apply(void 0, iterables);
};
function* compress(iterable, selectors) {
    for (const [el, sel] of builtins_1.zip(iterable, selectors))
        if (sel)
            yield el;
}
function* drop_while(predicate, iterable) {
    const it = builtins_1.iter(iterable);
    for (const el of it) {
        if (!predicate(el)) {
            yield el;
            yield* it;
        }
    }
}
const dropWhile = drop_while;
function* filter_false(predicate, iterable) {
    if (!predicate)
        predicate = Boolean;
    for (const el of iterable)
        if (predicate(el))
            yield el;
}
const fiterFalse = filter_false;
function* groupby(iterable, key = (key) => key) {
    let currKey, lastKey, lastVal, times;
    for (const el of iterable) {
        if (times === void 0) {
            times = 0;
            lastKey = key((lastVal = el));
        }
        currKey = key(el);
        if (lastKey !== currKey) {
            yield [lastKey, repeat(lastVal, times)];
            lastKey = currKey;
            lastVal = el;
            times = 0;
        }
        lastVal = el;
        ++times;
    }
    yield [lastKey, repeat(lastVal, times)];
}
const groupBy = groupby;
function* islice(iterable, ...args) {
    let [start, end, step = 1] = args;
    if (!Number.isInteger(step) || step <= 0)
        throw new errors_1.ValueError('Step for islice() must be a positive integer or None.');
    if (start === void 0)
        throw new TypeError('islice expected a start value');
    if (end === void 0)
        [start, end] = [0, start];
    const it = builtins_1.iter(iterable);
    for (let _ = 0; _ < start; ++_)
        it.next();
    for (let _ = start; _ < end; _ += step) {
        yield it.next().value;
        for (let __ = 0; __ < step - 1; ++__)
            it.next();
    }
}
function* takewhile(predicate, iterable) {
    for (const el of iterable)
        if (predicate(el))
            yield el;
        else
            break;
}
const takeWhile = takewhile;
function tee(iterable, n = 2) {
    if (!Number.isInteger(n))
        throw new TypeError(`integer argument expected`);
    if (n < 0)
        throw new errors_1.ValueError('n must be >= 0');
    const it = builtins_1.iter(iterable);
    const deques = [];
    for (let _ = 0; _ < n; ++_)
        deques.push([]);
    function* gen(deque) {
        while (true) {
            if (!deque.length) {
                const next = it.next();
                if (next.done)
                    return;
                for (const d of deques)
                    d.push(next.value);
            }
            yield deque.shift();
        }
    }
    return deques.map((d) => gen(d));
}
function zip_longest({ fillValue }) {
    function* zip(...iterables) {
        const iterators = iterables.map((it) => builtins_1.iter(it));
        let n = iterators.length;
        while (n !== 0) {
            const result = [];
            n = iterators.length;
            for (const it of iterators) {
                const next = it.next();
                if (next.done) {
                    result.push(fillValue);
                    --n;
                }
                else
                    result.push(next.value);
            }
            if (n)
                yield result;
        }
    }
    return zip;
}
function* _zip_longest(...iterables) {
    const iterators = iterables.map((it) => builtins_1.iter(it));
    let n = iterators.length;
    while (n !== 0) {
        const result = [];
        n = iterators.length;
        for (const it of iterators) {
            const next = it.next();
            if (next.done) {
                result.push(this.fillValue);
                --n;
            }
            else
                result.push(next.value);
        }
        if (n)
            yield result;
    }
}
const _zipLongest = utils_1.keywordFunction(_zip_longest, {
    before: true,
    optional: true,
    requiredKws: ['fillValue'],
});
const zipLongest = zip_longest;
function product(...args) {
    if (!args.length)
        return _identityGen([]);
    const [{ repeat }] = args;
    function* product(...iterables) {
        let saved = iterables.map((it) => [...it]);
        if (repeat)
            for (let _ = 2, tmp = Array.from(saved); _ <= repeat; ++_)
                saved = saved.concat(tmp);
        const indexes = Array(saved.length).fill(0);
        while (true) {
            yield indexes.map((i, idx) => saved[idx][i]);
            for (let i = indexes.length - 1; i >= 0; --i)
                if (++indexes[i] >= saved[i].length) {
                    if (i === 0)
                        return;
                    indexes[i] = 0;
                    continue;
                }
                else
                    break;
        }
    }
    if (!repeat)
        return product(...args);
    if (repeat <= 0 || !Number.isInteger(repeat))
        return _identityGen([]);
    return product;
}
// console.log('product', [...product({ repeat: 2 })(range(3))]);
const test = _zipLongest(builtins_1.range(10), builtins_1.range(5));
console.log(_zipLongest({ fillValue: 't' }));
console.log([..._zipLongest(builtins_1.range(10), builtins_1.range(5))]);
exports.default = {};
