import { Model, Relation } from '@nozbe/watermelondb';
import {
  date,
  field,
  json,
  readonly,
  relation,
  text,
} from '@nozbe/watermelondb/decorators';
import Cliente from './Cliente';
import Endereco from './Endereco';
import Tecnico from './Tecnico';

const sanitizeJson = (rawJson: any) => rawJson;

export default class OrdemDeServico extends Model {
  static override table = 'ordens_de_servico';

  static override associations = {
    clientes: { type: 'belongs_to', key: 'cliente_id' },
    enderecos: { type: 'belongs_to', key: 'endereco_id' },
    tecnicos: { type: 'belongs_to', key: 'tecnico_responsavel_id' },
  } as const;

  @text('numero_os') numeroOs!: string;
  @field('status') status!: string;

  @json('problema_detalhado', sanitizeJson) problemaDetalhado!: object[];

  @field('cliente_id') clienteId!: string;
  @field('endereco_id') enderecoId!: string;
  @field('tecnico_responsavel_id') tecnicoResponsavelId!: string;

  @relation('clientes', 'cliente_id') cliente!: Relation<Cliente>;
  @relation('enderecos', 'endereco_id') endereco!: Relation<Endereco>;
  @relation('tecnicos', 'tecnico_responsavel_id')
  tecnicoResponsavel!: Relation<Tecnico>;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
