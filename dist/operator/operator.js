"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xor = exports.truth = exports.div = exports.trueDiv = exports.truediv = exports.sub = exports.setItem = exports.setitem = exports.rShift = exports.rshift = exports.pow = exports.pos = exports.or = exports.not = exports.neg = exports.ne = exports.mul = exports.mod = exports.lt = exports.lShift = exports.lshift = exports.le = exports.isNot = exports.is_not = exports.is = exports.invert = exports.inv = exports.gt = exports.getItem = exports.getitem = exports.ge = exports.floorDiv = exports.floordiv = exports.eq = exports.delItem = exports.delitem = exports.contains = exports.concat = exports.and = exports.add = exports.abs = void 0;
function abs(a) {
    return Math.abs(a);
}
exports.abs = abs;
function add(a, b) {
    return a + b;
}
exports.add = add;
function and(a, b) {
    return a && b;
}
exports.and = and;
function concat(a, b) {
    return a.concat(b);
}
exports.concat = concat;
function contains(a, b) {
    return a in b;
}
exports.contains = contains;
function delitem(a, b) {
    delete a[b];
}
exports.delitem = delitem;
exports.delItem = delitem;
function eq(a, b) {
    return a == b;
}
exports.eq = eq;
function floordiv(a, b) {
    return Math.floor(a / b);
}
exports.floordiv = floordiv;
exports.floorDiv = floordiv;
function ge(a, b) {
    return a >= b;
}
exports.ge = ge;
function getitem(a, b) {
    return a[b];
}
exports.getitem = getitem;
exports.getItem = getitem;
function gt(a, b) {
    return a > b;
}
exports.gt = gt;
function inv(a) {
    return -a - 1;
}
exports.inv = inv;
exports.invert = inv;
function is(a, b) {
    return a === b;
}
exports.is = is;
function is_not(a, b) {
    return a !== b;
}
exports.is_not = is_not;
exports.isNot = is_not;
function le(a, b) {
    return a <= b;
}
exports.le = le;
function lshift(a, b) {
    return a << b;
}
exports.lshift = lshift;
exports.lShift = lshift;
function lt(a, b) {
    return a < b;
}
exports.lt = lt;
function mod(a, b) {
    return a % b;
}
exports.mod = mod;
function mul(a, b) {
    return a * b;
}
exports.mul = mul;
function ne(a, b) {
    return a == b;
}
exports.ne = ne;
function neg(a) {
    return -a;
}
exports.neg = neg;
function not(a) {
    return !a;
}
exports.not = not;
function or(a, b) {
    return a || b;
}
exports.or = or;
function pos(a) {
    return +a;
}
exports.pos = pos;
function pow(a, b) {
    return Math.pow(a, b);
}
exports.pow = pow;
function rshift(a, b) {
    return a >> b;
}
exports.rshift = rshift;
exports.rShift = rshift;
function setitem(a, b, c) {
    return (a[b] = c);
}
exports.setitem = setitem;
exports.setItem = setitem;
function sub(a, b) {
    return a - b;
}
exports.sub = sub;
function truediv(a, b) {
    return a / b;
}
exports.truediv = truediv;
exports.trueDiv = truediv;
exports.div = truediv;
function truth(a) {
    return Boolean(a);
}
exports.truth = truth;
function xor(a, b) {
    return a ^ b;
}
exports.xor = xor;
exports.default = {
    abs,
    add,
    and,
    concat,
    contains,
    delitem,
    delItem: exports.delItem,
    eq,
    floordiv,
    floorDiv: exports.floorDiv,
    ge,
    getitem,
    getItem: exports.getItem,
    gt,
    inv,
    invert: exports.invert,
    is_not,
    le,
    lshift,
    lShift: exports.lShift,
    lt,
    mod,
    mul,
    ne,
    neg,
    not,
    pos,
    pow,
    rshift,
    rShift: exports.rShift,
    setitem,
    setItem: exports.setItem,
    sub,
    truediv,
    trueDiv: exports.trueDiv,
    div: exports.div,
    truth,
    xor,
};
