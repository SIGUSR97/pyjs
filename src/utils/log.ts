const util = require('util');

function logComplete(...args: any[]): void {
  console.log(
    ...args.map((arg) => util.inspect(arg, { showHidden: true, depth: null })),
  );
};

export { logComplete };
