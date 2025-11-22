export interface DefectOption {
  label: string;
  value: string;
}

export interface DefectFormState {
  [categoria: string]: {
    selected: string[];
    outro?: string;
    descricao?: string;
    imagensTemporarias?: string[];
  };
}
