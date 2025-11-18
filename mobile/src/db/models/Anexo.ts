import { Model, Relation } from '@nozbe/watermelondb';
import {
  date,
  field,
  readonly,
  relation,
  text,
} from '@nozbe/watermelondb/decorators';
import OrdemDeServico from './OrdemDeServico';

export default class Anexo extends Model {
  static table = 'anexos';

  static associations = {
    ordens_de_servico: { type: 'belongs_to', key: 'ordem_de_servico_id' },
  } as const;

  @text('url_arquivo') urlArquivo!: string;
  @text('tipo_arquivo') tipoArquivo!: string;
  @text('descricao') descricao?: string;

  @field('ordem_de_servico_id') ordemDeServicoId!: string;

  @relation('ordens_de_servico', 'ordem_de_servico_id')
  ordemDeServico!: Relation<OrdemDeServico>;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
