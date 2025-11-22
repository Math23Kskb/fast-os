export type AppStackParamList = {
  ListOS: undefined;
  InfoOS: { visitaId: string };
  RegistroEtapa: { visitaId: string };
  DefectForm: { osId: string };
};

export type RootStackParamList = {
  Login: undefined;
  App: { screen: keyof AppStackParamList };
};
