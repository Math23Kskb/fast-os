jest.mock('@nozbe/watermelondb', () => ({
  // Mock das classes
  Database: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        observe: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      }),
    }),
  })),
  Model: class Model {},

  field: jest.fn(),
  text: jest.fn(),
  date: jest.fn(),
  readonly: jest.fn(),
  children: jest.fn(),

  appSchema: jest.fn(() => ({})),
  tableSchema: jest.fn(() => ({})),
}));

jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return jest.fn().mockImplementation(() => {
    return {};
  });
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
