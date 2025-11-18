import { Model, Relation } from '@nozbe/watermelondb';
import {
  field,
  relation,
  text,
  readonly,
  date,
} from '@nozbe/watermelondb/decorators';
import { Cliente } from './Cliente';

export default class Endereco extends Model {
  static override table = 'enderecos';

  static associations = {
    clientes: { type: 'belongs_to', key: 'cliente_id' },
  } as const;

  @text('logradouro') logradouro!: string;
  @field('numero') numero!: string;
  @field('cidade') cidade!: string;
  @field('estado') estado!: string;
  @field('cliente_id') clienteId!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('clientes', 'cliente_id') cliente!: Relation<Cliente>;
}
