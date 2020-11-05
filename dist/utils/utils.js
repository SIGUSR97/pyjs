"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordFunction = exports.isVoid = void 0;
const errors_1 = require("../errors");
function isVoid(val) {
    return val === void 0 && !val;
}
exports.isVoid = isVoid;
function keywordFunction(func, { before = true, optional = false, requiredKws = [], defaultKws = {}, } = {}) {
    if (requiredKws.some((kw) => kw in defaultKws))
        throw new errors_1.ValueError('Required keyword cannot have a default value');
    if (!before && optional)
        throw new errors_1.ValueError('After keyword function cannot be optional');
    function KwFuncBefore(...args) {
        const context = Object.assign({}, args[0]);
        if (optional &&
            (!requiredKws.length || requiredKws.some((kw) => !(kw in context)))) {
            console.log('execute default');
            assignDefault(context, defaultKws);
            return func.apply(context, args);
        }
        assignDefault(context, defaultKws);
        for (const req of requiredKws)
            if (!(req in context))
                throw new TypeError(`Required '${req}' keyword not found`);
        console.log('return KwFunc');
        return func.bind(context);
    }
    if (before)
        return KwFuncBefore;
    function KwFuncAfter(...args) {
        function inner(kws_) {
            const context = Object.assign({}, kws_);
            for (const req of requiredKws)
                if (!(req in context))
                    throw new TypeError(`Required '${req}' keyword not found`);
            assignDefault(context, defaultKws);
            return func.apply(context, args);
        }
        return inner;
    }
    return KwFuncAfter;
}
exports.keywordFunction = keywordFunction;
function assignDefault(target, source) {
    Object.keys(source)
        .filter((k) => !(k in target))
        .forEach((prop) => (target[prop] = source[prop]));
    return target;
}
function _test(a, b) {
    console.log('test', a, b, this.c, this);
    return a + b + this.c;
}
const test = keywordFunction(_test, {
    before: true,
    optional: true,
    requiredKws: ['c'],
});
console.log(test(1, 2));
exports.default = { isVoid, keywordFunction };
