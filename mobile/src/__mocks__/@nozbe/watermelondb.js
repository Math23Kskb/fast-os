export class Database {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(options) {}
  get = jest.fn(() => ({
    query: jest.fn(() => ({
      observe: jest.fn(() => ({ subscribe: jest.fn() })),
    })),
  }));
}

export class Model {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(collection, raw) {}
}

export const field = jest.fn();
export const text = jest.fn();
