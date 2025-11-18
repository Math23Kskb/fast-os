export type AppStackParamList = {
  ListOS: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  App: { screen: keyof AppStackParamList };
};
