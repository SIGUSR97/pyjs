import { MC, nn } from '../utils/noNew';
import { KeyError } from '../errors';
import { zip } from '../builtins/bltinmodule';

type IterableMapping = Array<[any, any]>;

class _Link {
  prev?: _Link;
  next?: _Link;
  key?: any;

  public clear() {
    delete this.key;
    delete this.prev;
    delete this.next;
  }
}

interface ValidLink extends _Link {
  prev: _Link;
  next: _Link;
  key: any;
}

class $OrderedDict {
  private _root: ValidLink;
  private _map: Map<any, any>;
  private _linkMap: Map<any, any>;
  [propName: string]: any;

  constructor(dict: object | Array<[any, any]> = {}) {
    const root = new _Link();
    root.prev = root.next = root;
    this._root = root as ValidLink;
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
        if (this[prop as string] !== void 0)
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

  public update(dict: object): void {
    let it = dict;
    if (!Array.isArray(dict)) {
      it = Object.entries(dict);
    }

    const root = this._root;
    let last = root;
    for (const [k, v] of it as IterableMapping) {
      const curr = new _Link() as ValidLink;
      [curr.key, last.next, curr.prev] = [k, curr, last];
      last = curr;

      this._linkMap.set(k, curr);
      this._map.set(k, v);
    }
    last.next = root;
    root.prev = last;
  }

  public get(key: any): any {
    return this._getItem(key);
  }

  public set(key: any, value: any): void {
    this._setItem(key, value);
  }

  public clear(): void {
    const root = this._root;
    root.next = root.prev = root;
    this._map.clear();
    this._linkMap.clear();
  }

  public popItem(last: boolean = true): [any, any] {
    if (!this._map.size) throw new KeyError('dictionary is empty');
    let link;
    const root = this._root;
    
    if (last) {
      link = root.prev as ValidLink;
      root.prev = link.prev;
      link.prev.next = root;
    } else {
      link = root.next as ValidLink;
      root.next = link.next;
      link.next.prev = root;
    }

    const { key } = link;
    const value = this._getItem(key);
    this._deleteItem(key);
    return [key, value];
  }

  public moveToEnd(key: any, last: boolean = true): void {
    const link = this._linkMap.get(key);
    if (link === void 0) throw new KeyError(key);
    const root = this._root;
    link.prev.next = link.next;
    link.next.prev = link.prev;
    if (last) {
      const last = root.prev;
      last.next = link;
      link.prev = last;
      link.next = root;
      root.prev = link;
    } else {
      const first = root.next;
      first.prev = link;
      link.next = first;
      link.prev = root;
      root.next = link;
    }
  }

  public pop(key: any, default_?: any): any {
    const link = this._linkMap.get(key);
    if (link === void 0)
      if (default_ === void 0) throw new KeyError(key);
      else return default_;

    this._deleteItem(key);
    return this._map.get(link.key);
  }

  public keys(): Array<any> {
    return [...this];
  }

  public values(): Array<any> {
    return [...this].map((k) => this._getItem(k));
  }

  public items(): Array<[any, any]> {
    return [...zip(this.keys(), this.values())];
  }

  public get size() {
    return this._map.size;
  }

  public *[Symbol.iterator]() {
    const root = this._root;
    let curr = root.next;

    while (curr !== root) {
      yield curr.key;
      curr = curr.next as ValidLink;
    }
  }

  private _getItem(key: any): any {
    return this._map.get(key);
  }

  private _setItem(key: any, value: any): void {
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

  private _deleteItem(key: any): boolean {
    if (!this._has(key)) return false;
    const link = this._linkMap.get(key);
    const { prev, next } = link;
    [prev.next, next.prev] = [next, prev];
    link.clear();

    this._linkMap.delete(key);
    return this._map.delete(key);
  }

  private _has(prop: any): boolean {
    return this._map.has(prop);
  }
}
type OrderedDict = $OrderedDict;
const OrderedDict: MC<OrderedDict> = nn($OrderedDict);

// const dict = OrderedDict({ t1: 1, t2: 2, t3: 3 });
// console.log(dict.items());

export default OrderedDict;
