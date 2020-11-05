"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../utils/log");
const noNew_1 = require("../utils/noNew");
const errors_1 = require("../errors");
class $List {
    constructor(iterable = []) {
        const data = Array.from(iterable);
        this.data = data;
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                prop = this.validIndex(prop);
                if (Number.isInteger(prop))
                    return Reflect.get(data, prop);
                return Reflect.get(target, prop, receiver) || Reflect.get(data, prop);
            },
            set: (target, prop, value, receiver) => {
                prop = this.validIndex(prop);
                if (Number.isInteger(prop))
                    return Reflect.set(data, prop, value);
                return Reflect.set(target, prop, value, receiver);
            },
            deleteProperty: (target, prop) => {
                prop = this.validIndex(prop);
                if (Number.isInteger(prop))
                    return Reflect.deleteProperty(data, prop);
                return Reflect.deleteProperty(target, prop);
            },
        });
    }
    append(item) {
        this.data.push(item);
    }
    clear() {
        this.data.splice(0, this.data.length);
    }
    pop(index = -1) {
        const data = this.data;
        if (!data.length)
            throw new errors_1.IndexError('pop from empty list');
        const popIndex = this.validIndex(index);
        if (typeof popIndex !== 'number' ||
            popIndex < 0 ||
            popIndex >= data.length) {
            throw new errors_1.IndexError('pop index out of range');
        }
        const [result] = data.splice(popIndex, 1);
        return result;
    }
    reverse() {
        const data = this.data;
        const len = data.length;
        const mid = Math.trunc(len / 2);
        for (let i = 0; i < mid; ++i) {
            console.log('i', i);
            [data[i], data[len - 1 - i]] = [data[len - 1 - i], data[i]];
        }
    }
    toString() {
        return `[${this.data.join(', ')}]`;
    }
    validIndex(prop) {
        let index;
        if ((typeof prop === 'string' || typeof prop === 'number') &&
            /^[0-9\+-]+$/.test(prop)) {
            index = Number(prop);
            const len = this.data.length;
            if (-len <= index && index < len)
                return index < 0 ? len + index : index;
            else
                return index;
        }
        return prop;
    }
}
const list = noNew_1.nn($List);
log_1.logComplete('ListConstructor', list);
const ls = new list([1, 2, 3]);
console.log(ls);
for (let i of [-1, -2, -3, -4]) {
    console.log(i, ls[i]);
}
