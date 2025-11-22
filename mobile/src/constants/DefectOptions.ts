import { DefectOption } from '../types/defect';

export const CATEGORY_KEYS = [
  'REFRIGERACAO',
  'VAZAMENTO',
  'ILUMINACAO',
  'ESTRUTURA',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  REFRIGERACAO: 'Refrigeração',
  VAZAMENTO: 'Vazamento',
  ILUMINACAO: 'Iluminação',
  ESTRUTURA: 'Estrutura',
};

export const DEFECT_OPTIONS: Record<CategoryKey, DefectOption[]> = {
  REFRIGERACAO: [
    { label: 'Compressor', value: 'COMPRESSOR' },
    { label: 'Solenoide', value: 'SOLENOIDE' },
    { label: 'Controlador', value: 'CONTROLADOR' },
    { label: 'Micromotor', value: 'MICROMOTOR' },
    { label: 'Filtro', value: 'FILTRO' },
    { label: 'Condensador', value: 'CONDENSADOR' },
    { label: 'Micro Canal', value: 'MICRO_CANAL' },
    { label: 'Capilar', value: 'CAPILAR' },
    { label: 'Tubulação', value: 'TUBULACAO' },
    { label: 'Sensor de Temperatura', value: 'SENSOR_TEMPERATURA' },
    { label: 'Reoperação', value: 'REOPERACAO' },
    { label: 'Caixa Elétrica', value: 'CAIXA_ELETRICA' },
    { label: 'Protetor Térmico', value: 'PROTETOR_TERMICO' },
    { label: 'Resistência de Degelo', value: 'RESISTENCIA_DEG' },
    { label: 'Elétrica', value: 'ELETRICA' },
    { label: 'Outros', value: 'OUTROS' },
  ],
  VAZAMENTO: [
    { label: 'Condensador', value: 'CONDENSADOR' },
    { label: 'Evaporador', value: 'EVAPORADOR' },
    { label: 'Oxidação', value: 'OXIDACAO' },
    { label: 'Não Localizado', value: 'NAO_LOCALIZADO' },
  ],
  ILUMINACAO: [
    { label: 'Lâmpada', value: 'LAMPADA' },
    { label: 'LED Prateleira', value: 'LED_PRATELEIRA' },
    { label: 'Outros', value: 'OUTROS' },
  ],
  ESTRUTURA: [
    { label: 'Porta', value: 'PORTA' },
    { label: 'Puxador', value: 'PUXADOR' },
    { label: 'Perfil', value: 'PERFIL' },
    { label: 'Para-choque', value: 'PARACHOQUE' },
    { label: 'Vidro', value: 'VIDRO' },
    { label: 'Resistência do Vidro', value: 'RESISTENCIA_VIDRO' },
    { label: 'Perfil de Vedação', value: 'PERFIL_VEDACAO' },
    { label: 'Porta Etiqueta', value: 'PORTA_ETIQUETA' },
    { label: 'Oxidação', value: 'OXIDACAO' },
    { label: 'Sujeira ou Mancha', value: 'SUJEIRA_OU_MANCHA' },
    { label: 'Desplaque', value: 'DESPLAQUE' },
    { label: 'Outros', value: 'OUTROS' },
  ],
};
