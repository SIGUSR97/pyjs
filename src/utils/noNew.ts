type NC<C, P extends any[] = any[]> = { new (...args: P): C };
type FC<C, P extends any[] = any[]> = { (...args: P): C };
type MC<C, P extends any[] = any[]> = NC<C, P> & FC<C, P>;
function nn<C>(cls: NC<C>): MC<C> {
  return new Proxy(cls, {
    apply: (t, _, a) => new t(...a),
  }) as MC<C>;
}

export { NC, FC, MC, nn };
