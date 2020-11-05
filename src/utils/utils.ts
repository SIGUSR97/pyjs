import { ValueError } from '../errors';

type Function = (...args: any) => any;

type KwFuncBefore<K extends Record<keyof any, any>, F extends Function> = (
  kws: K,
) => (...args: Parameters<F>) => ReturnType<F>;

// type OptionalKwFuncBefore<K extends keyof any, F extends Function> = (
//   ...args: [Record<K, any>] | Array<any>
// ) => typeof args extends [Record<K, any>]
//   ? (...args: Parameters<F>) => ReturnType<F>
//   : ReturnType<F>;

type KwFuncAfter<K extends Record<keyof any, any>, F extends Function> = (
  ...args: Parameters<F>
) => (kws: K) => ReturnType<F>;

export function isVoid(val: any): boolean {
  return val === void 0 && !val;
}

// type KeywordFunctionOptions = {
//   readonly before?: boolean;
//   readonly optional?: boolean;
//   readonly requiredKws?: ReadonlyArray<string>;
//   readonly defaultKws?: { [kw: string]: any };
// };

type KeywordFunctionOptions = {
  readonly before?: boolean;
  readonly defaultKws?: { [kw: string]: any };
};

// type KeywordFunctionReturns<
//   B extends boolean,
//   O extends boolean,
//   K extends keyof any,
//   F extends Function
// > = B extends false
//   ? O extends false
//     ? OptionalKwFuncBefore<K, F>
//     : KwFuncBefore<K, F>
//   : KwFuncAfter<K, F>;

type KeywordFunctionReturns<
  B extends boolean,
  K extends ReadonlyArray<keyof any>,
  F extends Function
> = B extends true ? KwFuncBefore<K, F> : KwFuncAfter<K, F>;

export function keywordFunction<K extends Record<keyof any, any>>(
  func: Function,
  { before = true, defaultKws = {} }: KeywordFunctionOptions = {},
): typeof before extends false
  ? KwFuncBefore<K, typeof func>
  : KwFuncAfter<K, typeof func> {
  type Params = Parameters<typeof func>;
  type Returns = ReturnType<typeof func>;

  function KwFuncBefore(
    ...args: [K] | Array<any>
  ): (...args: Params) => Returns {
    const context = Object.assign({}, args[0]);

    assignDefault(context, defaultKws);
    // for (const req of requiredKws)
    //   if (!(req in context))
    //     throw new TypeError(`Required '${req}' keyword not found`);
    console.log('return KwFunc');

    return func.bind(context);
  }
  if (before) return KwFuncBefore as any;
  function KwFuncAfter(...args: Params): (kws: K) => Returns {
    function inner(kws_: K) {
      const context = Object.assign({}, kws_);
      // for (const req of requiredKws)
      //   if (!(req in context))
      //     throw new TypeError(`Required '${req}' keyword not found`);
      assignDefault(context, defaultKws);
      return func.apply(context, args);
    }
    return inner;
  }
  return KwFuncAfter as any;
}

function assignDefault<T extends { [prop: string]: any }, K extends keyof T>(
  target: T,
  source: any,
): T {
  Object.keys(source)
    .filter((k) => !(k in target))
    .forEach((prop) => (target[prop as K] = source[prop]));
  return target;
}

function _test(this: { c: number }, a: number, b: number): number {
  console.log('test', a, b, this.c, this);
  return a + b + this.c;
}
const test = keywordFunction<{c?:number}>(_test, {
  before: true,
});
// let True = true;
// type test2 = typeof True;

const test1 = test();
// const test2 = test({c: 2})(1, 2)
console.log(test(1, 2));

export default { isVoid, keywordFunction };
