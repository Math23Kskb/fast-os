import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { mySchema } from './schema';

import Tecnico from './models/Tecnico';
import Cliente from './models/Cliente';
import Endereco from './models/Endereco';
import Visita from './models/Visita';
import OrdemDeServico from './models/OrdemDeServico';
import Anexo from './models/Anexo';

console.log('[DB] INICIANDO CONFIGURAÇÃO DO WATERMELONDB...');

const adapter = new SQLiteAdapter({
  schema: mySchema,
  dbName: 'fastos-db',
  // jsi: true,
  onSetUpError: (error) => {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!  ERRO CRÍTICO NA CONFIGURAÇÃO DO WATERMELONDB  !!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(error);
  },
});

console.log('[DB] Adaptador SQLite criado.');

export const database = new Database({
  adapter,
  modelClasses: [Tecnico, Cliente, Endereco, Visita, OrdemDeServico, Anexo],
});

console.log('[DB] Instância do banco de dados criada com sucesso!');
