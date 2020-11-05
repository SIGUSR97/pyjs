import operator, { concat } from '../operator';
import { zip, iter, range } from '../builtins';
import { ValueError } from '../errors';
import { keywordFunction } from '../utils/utils';

type Iterable = IterableIterator<any> | string;
type FilterFunc = (value: any) => boolean;
type GeneratorFunc = (...args: Array<any>) => Iterable;

interface CallbackFunc<Args extends Array<any>, Returns = any> {
  (...args: Args): Returns;
}

function* _emptyGen(...args: Array<any>): Iterable {}
function* _identityGen(val?: any): Iterable {
  yield val;
}

function* count(start: number = 0, step: number = 1): IterableIterator<number> {
  yield start;
  while (true) yield ((start += step), start);
}

function* cycle<T>(iterable: IterableIterator<T>): IterableIterator<T> {
  const saved = [];
  for (const i of iterable) yield (saved.push(i), i);
  while (true) for (const i of saved) yield i;
}

function* repeat<T>(obj: T, times: number = Infinity) {
  for (let i = 0; i < times; ++i) yield obj;
}

type AccFunc<T> = CallbackFunc<[T, T], T>;

function* accumulate<T>(
  iterable: IterableIterator<T>,
  func: AccFunc<T> = operator.add as AccFunc<any>,
  initial?: any,
): IterableIterator<T> {
  const it = iter(iterable);
  let total = initial;
  if (initial === void 0) {
    const next = it.next();
    if (next.done) return;
    total = next.value;
  }
  yield total;
  for (const el of it) {
    yield (total = func(total, el));
  }
}

function* chain(...iterables: Array<Iterable>): Iterable {
  for (const it of iterables) yield* it;
}

chain.fromIterable = chain.from_iterable = function (
  iterables: Array<Iterable>,
): Iterable {
  return this.apply(void 0, iterables);
};

function* compress(iterable: Iterable, selectors: Iterable): Iterable {
  for (const [el, sel] of zip(iterable, selectors)) if (sel) yield el;
}

function* drop_while(predicate: FilterFunc, iterable: Iterable): Iterable {
  const it = iter(iterable);
  for (const el of it) {
    if (!predicate(el)) {
      yield el;
      yield* it;
    }
  }
}
const dropWhile = drop_while;

function* filter_false(predicate: FilterFunc, iterable: Iterable): Iterable {
  if (!predicate) predicate = Boolean;
  for (const el of iterable) if (predicate(el)) yield el;
}
const fiterFalse = filter_false;

function* groupby(
  iterable: Iterable,
  key: (key: any) => any = (key) => key,
): IterableIterator<[any, any]> {
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

function islice<T>(
  iterable: IterableIterator<T>,
  end: number,
): IterableIterator<T>;
function islice<T>(
  iterable: IterableIterator<T>,
  start: number,
  end: number,
): IterableIterator<T>;
function islice<T>(
  iterable: IterableIterator<T>,
  start: number,
  end: number,
  step: number,
): IterableIterator<T>;

function* islice<T>(
  iterable: IterableIterator<T>,
  ...args: [start: number, end?: number, step?: number]
): IterableIterator<T> {
  let [start, end, step = 1] = args;
  if (!Number.isInteger(step) || step <= 0)
    throw new ValueError(
      'Step for islice() must be a positive integer or None.',
    );
  if (start === void 0) throw new TypeError('islice expected a start value');
  if (end === void 0) [start, end] = [0, start];
  const it = iter(iterable);
  for (let _ = 0; _ < start; ++_) it.next();
  for (let _ = start; _ < end; _ += step) {
    yield it.next().value;
    for (let __ = 0; __ < step - 1; ++__) it.next();
  }
}

function* takewhile<T>(
  predicate: FilterFunc,
  iterable: IterableIterator<T>,
): IterableIterator<T> {
  for (const el of iterable)
    if (predicate(el)) yield el;
    else break;
}
const takeWhile = takewhile;

function tee<T>(
  iterable: IterableIterator<T>,
  n: number = 2,
): Array<IterableIterator<T>> {
  if (!Number.isInteger(n)) throw new TypeError(`integer argument expected`);
  if (n < 0) throw new ValueError('n must be >= 0');

  const it = iter(iterable);
  const deques: Array<any[]> = [];
  for (let _ = 0; _ < n; ++_) deques.push([]);
  function* gen(deque: Array<T>): IterableIterator<T> {
    while (true) {
      if (!deque.length) {
        const next = it.next();
        if (next.done) return;
        for (const d of deques) d.push(next.value);
      }
      yield deque.shift() as T;
    }
  }
  return deques.map((d) => gen(d));
}

function zip_longest({ fillValue }: { fillValue: any }): GeneratorFunc {
  function* zip(...iterables: Array<Iterable>): IterableIterator<Array<any>> {
    const iterators = iterables.map((it) => iter(it));
    let n = iterators.length;
    while (n !== 0) {
      const result = [];
      n = iterators.length;
      for (const it of iterators) {
        const next = it.next();
        if (next.done) {
          result.push(fillValue);
          --n;
        } else result.push(next.value);
      }
      if (n) yield result;
    }
  }
  return zip;
}
function* _zip_longest(
  this: { fillValue: any },
  ...iterables: Array<Iterable>
) {
  const iterators = iterables.map((it) => iter(it));
  let n = iterators.length;
  while (n !== 0) {
    const result = [];
    n = iterators.length;
    for (const it of iterators) {
      const next = it.next();
      if (next.done) {
        result.push(this.fillValue);
        --n;
      } else result.push(next.value);
    }
    if (n) yield result;
  }
}
const _zipLongest = keywordFunction(_zip_longest, {
  before: true,
})
const zipLongest = zip_longest;

type product = (...args: Array<Iterable>) => Iterable;
function product({ repeat }: { repeat: number }): product;
function product(...args: Array<Iterable>): Iterable;

function product(
  ...args: Array<any> | [{ repeat: number }]
): GeneratorFunc | Iterable {
  if (!args.length) return _identityGen([]);
  const [{ repeat }] = args;
  function* product(...iterables: Array<Iterable>): Iterable {
    let saved = iterables.map((it) => [...it]);
    if (repeat)
      for (let _ = 2, tmp = Array.from(saved); _ <= repeat; ++_)
        saved = saved.concat(tmp);
    const indexes = Array(saved.length).fill(0);
    while (true) {
      yield indexes.map((i, idx) => saved[idx][i]);
      for (let i = indexes.length - 1; i >= 0; --i)
        if (++indexes[i] >= saved[i].length) {
          if (i === 0) return;
          indexes[i] = 0;
          continue;
        } else break;
    }
  }

  if (!repeat) return product(...args);
  if (repeat <= 0 || !Number.isInteger(repeat)) return _identityGen([]);
  return product as GeneratorFunc;
}

// console.log('product', [...product({ repeat: 2 })(range(3))]);
const test = _zipLongest(range(10), range(5));
console.log(_zipLongest({fillValue: 't'}));
console.log([..._zipLongest(range(10), range(5))]);


export default {};
export {};
