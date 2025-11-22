// mobile/src/db/schema.ts

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1, // Começamos na versão 1
  tables: [
    tableSchema({
      name: 'tecnicos',
      columns: [
        { name: 'nome', type: 'string' },
        { name: 'matricula', type: 'string', isOptional: true },
        { name: 'ativo', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'clientes',
      columns: [
        { name: 'nome', type: 'string' },
        { name: 'contato', type: 'string', isOptional: true },
        { name: 'telefone', type: 'string', isOptional: true },
        { name: 'ativo', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'enderecos',
      columns: [
        { name: 'logradouro', type: 'string' },
        { name: 'numero', type: 'string', isOptional: true },
        { name: 'cidade', type: 'string' },
        { name: 'estado', type: 'string' },
        { name: 'cliente_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'ordens_de_servico',
      columns: [
        { name: 'numero_os', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'problema_detalhado', type: 'string', isOptional: true }, // JSON como texto
        { name: 'diagnostico_tecnico', type: 'string', isOptional: true },
        { name: 'solucao_aplicada', type: 'string', isOptional: true },
        { name: 'cliente_id', type: 'string', isIndexed: true },
        { name: 'endereco_id', type: 'string', isIndexed: true },
        { name: 'tecnico_responsavel_id', type: 'string', isIndexed: true },
        {
          name: 'visita_id',
          type: 'string',
          isIndexed: true,
          isOptional: true,
        },
        { name: 'data_inicio_execucao', type: 'number', isOptional: true },
        { name: 'data_fim_execucao', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'visitas',
      columns: [
        { name: 'status', type: 'string' },
        { name: 'tecnico_id', type: 'string', isIndexed: true },
        { name: 'endereco_id', type: 'string', isIndexed: true },
        { name: 'data_saida_empresa', type: 'number', isOptional: true },
        { name: 'data_chegada_cliente', type: 'number', isOptional: true },
        { name: 'data_saida_cliente', type: 'number', isOptional: true },
        { name: 'data_chegada_empresa', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'anexos',
      columns: [
        { name: 'url_arquivo', type: 'string' },
        { name: 'tipo_arquivo', type: 'string' },
        { name: 'descricao', type: 'string', isOptional: true },
        { name: 'ordem_de_servico_id', type: 'string', isIndexed: true },
        {
          name: 'visita_id',
          type: 'string',
          isIndexed: true,
          isOptional: true,
        },
        { name: 'etapa', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
