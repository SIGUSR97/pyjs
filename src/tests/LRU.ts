import { OrderedDict } from '../collections';
import * as collections from '../collections';

class LRU {
  data: OrderedDict;

  constructor(public cap: number = 128) {
    this.cap = cap;
    this.data = OrderedDict();
  }

  public get(key: any): any {
    const result = this.data.get(key);
    if (result === void 0) return;
    this.data.moveToEnd(key);
    return result;
  }
  public set(key: any, value: any): void {
    if (key in this.data) this.data.moveToEnd(key);
    this.data.set(key, value);
    if (this.data.size > this.cap) {
      this.data.popItem(false);
    }
  }
  public delete(key: any): void {
    this.data.pop(key);
  }
  public clear(): void {
    this.data.clear();
  }
  public get size() {
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
