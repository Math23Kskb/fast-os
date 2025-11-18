import { Model, Query } from '@nozbe/watermelondb';
import {
  children,
  field,
  text,
  readonly,
  date,
} from '@nozbe/watermelondb/decorators';
import { Endereco } from './Endereco';
import { OrdemDeServico } from './OrdemDeServico';

export default class Cliente extends Model {
  static override table = 'clientes';

  static associations = {
    enderecos: { type: 'has_many', foreignKey: 'cliente_id' },
    ordens_de_servico: { type: 'has_many', foreignKey: 'cliente_id' },
  } as const;

  @text('nome') nome!: string;
  @field('contato') contato!: string;
  @field('telefone') telefone!: string;
  @field('ativo') ativo!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('enderecos') enderecos!: Query<Endereco>;
  @children('ordens_de_servico') ordensDeServico!: Query<OrdemDeServico>;
}
