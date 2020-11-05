export class IndexError extends Error {
  constructor(...args: any[]) {
    super(...args);
    this.name = 'IndexError';
  }
}

export class KeyError extends Error {
  constructor(...args: any[]) {
    super(...args);
    this.name = 'KeyError';
  }
}

export class ValueError extends Error {
  constructor(...args: any[]) {
    super(...args);
    this.name = 'ValueError';
  }
}

export default { IndexError, KeyError, ValueError };
