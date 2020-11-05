"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collections_1 = require("../collections");
class LRU {
    constructor(cap = 128) {
        this.cap = cap;
        this.cap = cap;
        this.data = collections_1.OrderedDict();
    }
    get(key) {
        const result = this.data.get(key);
        if (result === void 0)
            return;
        this.data.moveToEnd(key);
        return result;
    }
    set(key, value) {
        if (key in this.data)
            this.data.moveToEnd(key);
        this.data.set(key, value);
        if (this.data.size > this.cap) {
            this.data.popItem(false);
        }
    }
    delete(key) {
        this.data.pop(key);
    }
    clear() {
        this.data.clear();
    }
    get size() {
        return this.data.size;
    }
}
const lru = new LRU(5);
lru.set('test0', 0);
lru.set('test1', 1);
lru.set('test2', 2);
lru.set('test3', 3);
lru.set('test4', 4);
lru.set('test5', 5);
lru.set('test6', 6);
lru.set('test7', 7);
console.log('data', lru.data);
