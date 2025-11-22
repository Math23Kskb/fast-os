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
import Visita from './Visita';
import type { DefectFormState } from '../../types/defect';

const sanitizeJson = (rawJson: any) => rawJson;

export default class OrdemDeServico extends Model {
  static override table = 'ordens_de_servico';

  static override associations = {
    clientes: { type: 'belongs_to', key: 'cliente_id' },
    enderecos: { type: 'belongs_to', key: 'endereco_id' },
    tecnicos: { type: 'belongs_to', key: 'tecnico_responsavel_id' },
    visitas: { type: 'belongs_to', key: 'visita_id' },
  } as const;

  @text('numero_os') numeroOs!: string;
  @field('status') status!: string;

  @json('problema_detalhado', sanitizeJson) problemaDetalhado!: DefectFormState;
  @text('diagnostico_tecnico') diagnosticoTecnico!: string;
  @text('solucao_aplicada') solucaoAplicada!: string;

  @field('cliente_id') clienteId!: string;
  @field('endereco_id') enderecoId!: string;
  @field('tecnico_responsavel_id') tecnicoResponsavelId!: string;
  @field('visita_id') visitaId!: string;

  @date('data_inicio_execucao') dataInicioExecucao?: Date;
  @date('data_fim_execucao') dataFimExecucao?: Date;

  @relation('clientes', 'cliente_id') cliente!: Relation<Cliente>;
  @relation('enderecos', 'endereco_id') endereco!: Relation<Endereco>;
  @relation('tecnicos', 'tecnico_responsavel_id')
  tecnicoResponsavel!: Relation<Tecnico>;
  @relation('visitas', 'visita_id') visita!: Relation<Visita>;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
