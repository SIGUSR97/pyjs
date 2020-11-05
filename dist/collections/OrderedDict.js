"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noNew_1 = require("../utils/noNew");
const errors_1 = require("../errors");
const bltinmodule_1 = require("../builtins/bltinmodule");
class _Link {
    clear() {
        delete this.key;
        delete this.prev;
        delete this.next;
    }
}
class $OrderedDict {
    constructor(dict = {}) {
        const root = new _Link();
        root.prev = root.next = root;
        this._root = root;
        this._map = new Map();
        this._linkMap = new Map();
        this.update(dict);
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'symbol')
                    return Reflect.get(target, prop, receiver).bind(this);
                return Reflect.get(target, prop, receiver) || this._getItem(prop);
            },
            set: (target, prop, value, receiver) => {
                if (this[prop] !== void 0)
                    return Reflect.set(target, prop, value, receiver);
                return this._setItem(prop, value), true;
            },
            deleteProperty: (target, prop) => {
                return this._deleteItem(prop);
            },
            has: (target, prop) => {
                return this._has(prop);
            },
        });
    }
    update(dict) {
        let it = dict;
        if (!Array.isArray(dict)) {
            it = Object.entries(dict);
        }
        const root = this._root;
        let last = root;
        for (const [k, v] of it) {
            const curr = new _Link();
            [curr.key, last.next, curr.prev] = [k, curr, last];
            last = curr;
            this._linkMap.set(k, curr);
            this._map.set(k, v);
        }
        last.next = root;
        root.prev = last;
    }
    get(key) {
        return this._getItem(key);
    }
    set(key, value) {
        this._setItem(key, value);
    }
    clear() {
        const root = this._root;
        root.next = root.prev = root;
        this._map.clear();
        this._linkMap.clear();
    }
    popItem(last = true) {
        if (!this._map.size)
            throw new errors_1.KeyError('dictionary is empty');
        let link;
        const root = this._root;
        if (last) {
            link = root.prev;
            root.prev = link.prev;
            link.prev.next = root;
        }
        else {
            link = root.next;
            root.next = link.next;
            link.next.prev = root;
        }
        const { key } = link;
        const value = this._getItem(key);
        this._deleteItem(key);
        return [key, value];
    }
    moveToEnd(key, last = true) {
        const link = this._linkMap.get(key);
        if (link === void 0)
            throw new errors_1.KeyError(key);
        const root = this._root;
        link.prev.next = link.next;
        link.next.prev = link.prev;
        if (last) {
            const last = root.prev;
            last.next = link;
            link.prev = last;
            link.next = root;
            root.prev = link;
        }
        else {
            const first = root.next;
            first.prev = link;
            link.next = first;
            link.prev = root;
            root.next = link;
        }
    }
    pop(key, default_) {
        const link = this._linkMap.get(key);
        if (link === void 0)
            if (default_ === void 0)
                throw new errors_1.KeyError(key);
            else
                return default_;
        this._deleteItem(key);
        return this._map.get(link.key);
    }
    keys() {
        return [...this];
    }
    values() {
        return [...this].map((k) => this._getItem(k));
    }
    items() {
        return [...bltinmodule_1.zip(this.keys(), this.values())];
    }
    get size() {
        return this._map.size;
    }
    *[Symbol.iterator]() {
        const root = this._root;
        let curr = root.next;
        while (curr !== root) {
            yield curr.key;
            curr = curr.next;
        }
    }
    _getItem(key) {
        return this._map.get(key);
    }
    _setItem(key, value) {
        if (!this._has(key)) {
            const root = this._root;
            const link = new _Link();
            const last = root.prev;
            [link.prev, link.next, link.key] = [last, root, key];
            root.prev = last.next = link;
            this._linkMap.set(key, link);
        }
        this._map.set(key, value);
    }
    _deleteItem(key) {
        if (!this._has(key))
            return false;
        const link = this._linkMap.get(key);
        const { prev, next } = link;
        [prev.next, next.prev] = [next, prev];
        link.clear();
        this._linkMap.delete(key);
        return this._map.delete(key);
    }
    _has(prop) {
        return this._map.has(prop);
    }
}
const OrderedDict = noNew_1.nn($OrderedDict);
// const dict = OrderedDict({ t1: 1, t2: 2, t3: 3 });
// console.log(dict.items());
exports.default = OrderedDict;
