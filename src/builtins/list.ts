import { logComplete } from '../utils/log';
import { MC, nn } from '../utils/noNew';
import { IndexError } from '../errors';

class $List {
  data: any[];
  [listItem: number]: any;

  constructor(iterable: any[] = []) {
    const data = Array.from(iterable);
    this.data = data;

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        prop = this.validIndex(prop);
        if (Number.isInteger(prop)) return Reflect.get(data, prop);
        return Reflect.get(target, prop, receiver) || Reflect.get(data, prop);
      },
      set: (target, prop, value, receiver) => {
        prop = this.validIndex(prop);
        if (Number.isInteger(prop)) return Reflect.set(data, prop, value);
        return Reflect.set(target, prop, value, receiver);
      },
      deleteProperty: (target, prop) => {
        prop = this.validIndex(prop);
        if (Number.isInteger(prop)) return Reflect.deleteProperty(data, prop);
        return Reflect.deleteProperty(target, prop);
      },
    });
  }

  public append(item: any): void {
    this.data.push(item);
  }

  public clear(): void {
    this.data.splice(0, this.data.length);
  }

  public pop(index = -1): any {
    const data = this.data;
    if (!data.length) throw new IndexError('pop from empty list');
    const popIndex = this.validIndex(index);
    if (
      typeof popIndex !== 'number' ||
      popIndex < 0 ||
      popIndex >= data.length
    ) {
      throw new IndexError('pop index out of range');
    }
    const [result] = data.splice(popIndex, 1);
    return result;
  }

  public reverse(): void {
    const data = this.data;
    const len = data.length;
    const mid = Math.trunc(len / 2);
    for (let i = 0; i < mid; ++i) {
      console.log('i', i);
      [data[i], data[len - 1 - i]] = [data[len - 1 - i], data[i]];
    }
  }

  public toString() {
    return `[${this.data.join(', ')}]`;
  }

  private validIndex(this: List, prop: PropertyKey): PropertyKey {
    let index;
    if (
      (typeof prop === 'string' || typeof prop === 'number') &&
      /^[0-9\+-]+$/.test(prop as string)
    ) {
      index = Number(prop);
      const len = this.data.length;
      if (-len <= index && index < len) return index < 0 ? len + index : index;
      else return index;
    }
    return prop;
  }
}
type List = $List;
const list: MC<List, [any[]]> = nn($List);

logComplete('ListConstructor', list);

const ls = new list([1, 2, 3]);
console.log(ls);
for (let i of [-1, -2, -3, -4]) {
  console.log(i, ls[i]);
}
