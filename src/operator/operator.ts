type Addable = number | string;

export function abs(a: number): number {
  return Math.abs(a);
}

export function add(a: Addable, b: Addable): Addable {
  return (a as string) + b;
}

export function and<A, B>(a: A, b: B): A | B | false {
  return a && b;
}

export function concat(a: Array<any>, b: Array<any>): Array<any> {
  return a.concat(b);
}

export function contains(a: any, b: Array<any>): boolean {
  return a in b;
}

export function delitem(a: any, b: PropertyKey): void {
  delete a[b];
}
export const delItem = delitem;

export function eq(a: any, b: any): boolean {
  return a == b;
}

export function floordiv(a: number, b: number): number {
  return Math.floor(a / b);
}

export const floorDiv = floordiv;

export function ge(a: number, b: number): boolean {
  return a >= b;
}

export function getitem(a: any, b: PropertyKey): any {
  return a[b];
}
export const getItem = getitem;

export function gt(a: number, b: number): boolean {
  return a > b;
}

export function inv(a: number): number {
  return -a - 1;
}

export const invert = inv;

export function is(a: any, b: any): boolean {
  return a === b;
}

export function is_not(a: any, b: any): boolean {
  return a !== b;
}
export const isNot = is_not;

export function le(a: number, b: number): boolean {
  return a <= b;
}

export function lshift(a: number, b: number): number {
  return a << b;
}
export const lShift = lshift;

export function lt(a: number, b: number): boolean {
  return a < b;
}

export function mod(a: number, b: number): number {
  return a % b;
}

export function mul(a: number, b: number): number {
  return a * b;
}

export function ne(a: any, b: any): boolean {
  return a == b;
}

export function neg(a: number): number {
  return -a;
}

export function not(a: any): boolean {
  return !a;
}

export function or<A, B>(a: A, b: B): A | B | false {
  return a || b;
}

export function pos(a: number): number {
  return +a;
}

export function pow(a: number, b: number): number {
  return a ** b;
}

export function rshift(a: number, b: number): number {
  return a >> b;
}
export const rShift = rshift;

export function setitem<T>(a: any, b: PropertyKey, c: T): T {
  return (a[b] = c);
}
export const setItem = setitem;

export function sub(a: number, b: number): number {
  return a - b;
}

export function truediv(a: number, b: number): number {
  return a / b;
}
export const trueDiv = truediv;
export const div = truediv;

export function truth(a: any): boolean {
  return Boolean(a);
}

export function xor(a: number, b: number): number {
  return a ^ b;
}

export default {
  abs,
  add,
  and,
  concat,
  contains,
  delitem,
  delItem,
  eq,
  floordiv,
  floorDiv,
  ge,
  getitem,
  getItem,
  gt,
  inv,
  invert,
  is_not,
  le,
  lshift,
  lShift,
  lt,
  mod,
  mul,
  ne,
  neg,
  not,
  pos,
  pow,
  rshift,
  rShift,
  setitem,
  setItem,
  sub,
  truediv,
  trueDiv,
  div,
  truth,
  xor,
};
