import { ValueError } from '../errors';

export function* zip(
  ...iterables: Array<Iterable<any>>
): IterableIterator<any> {
  const iterators = iterables.map((it) => iter(it));
  while (iterators.length) {
    const result = [];
    for (const it of iterators) {
      const next = it.next();
      if (next.done) return;
      result.push(next.value);
    }
    yield result;
  }
}

export function range(end: number): IterableIterator<number>;
export function range(start: number, end: number): IterableIterator<number>;
export function range(
  start: number,
  end: number,
  step: number,
): IterableIterator<number>;

export function* range(
  ...args: [number, number?, number?]
): IterableIterator<number> {
  let [start, end, step = 1] = args;
  if (end === void 0) [end, start] = [start, 0];
  for (const n of [start, end, step])
    if (!Number.isInteger(n))
      throw new TypeError(`'${n}' cannot be interpreted as an integer`);
  if (step === 0) throw new ValueError('range() arg 3 must not be zero');
  let return_;
  if (step > 0) return_ = (x: number) => x >= (end as number);
  else return_ = (x: number) => x <= (end as number);
  while (true) {
    if (return_(start)) return;
    yield start;
    start += step;
  }
}

export function iter(iterable: any): IterableIterator<any> {
  if (typeof iterable.next === 'function') return iterable;
  if (typeof iterable[Symbol.iterator] === 'function')
    return iterable[Symbol.iterator]();
  throw new TypeError(`'${typeof iterable}' object is not iterable`);
}

export default { zip, range, iter };
