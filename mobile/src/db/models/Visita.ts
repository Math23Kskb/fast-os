import { Model, Query, Relation } from '@nozbe/watermelondb';
import {
  field,
  relation,
  readonly,
  date,
  children,
} from '@nozbe/watermelondb/decorators';
import Tecnico from './Tecnico';
import Endereco from './Endereco';
import OrdemDeServico from './OrdemDeServico';

export default class Visita extends Model {
  static override table = 'visitas';

  static override associations = {
    tecnicos: { type: 'belongs_to', key: 'tecnico_id' },
    enderecos: { type: 'belongs_to', key: 'endereco_id' },
    ordens_de_servico: { type: 'has_many', foreignKey: 'visita_id' },
  } as const;

  @field('status') status!: string;
  @field('tecnico_id') tecnicoId!: string;
  @field('endereco_id') enderecoId!: string;

  @date('data_saida_empresa') dataSaidaEmpresa?: Date;
  @date('data_chegada_cliente') dataChegadaCliente?: Date;
  @date('data_saida_cliente') dataSaidaCliente?: Date;
  @date('data_chegada_empresa') dataChegadaEmpresa?: Date;

  @children('ordens_de_servico') ordens!: Query<OrdemDeServico>;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('tecnicos', 'tecnico_id') tecnico!: Relation<Tecnico>;
  @relation('enderecos', 'endereco_id') endereco!: Relation<Endereco>;
}
