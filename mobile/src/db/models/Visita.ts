import { Model, Relation } from '@nozbe/watermelondb';
import {
  field,
  relation,
  readonly,
  date,
} from '@nozbe/watermelondb/decorators';
import { Tecnico } from './Tecnico';
import { Endereco } from './Endereco';

interface VisitaRaw {
  id: RecordId;
  status: string;
  tecnico_id: string;
  endereco_id: string;
  created_at: number;
  updated_at: number;
}

export default class Visita extends Model {
  static override table = 'visitas';

  static associations = {
    tecnicos: { type: 'belongs_to', key: 'tecnico_id' },
    enderecos: { type: 'belongs_to', key: 'endereco_id' },
  } as const;

  @field('status') status!: string;
  @field('tecnico_id') tecnicoId!: string;
  @field('endereco_id') enderecoId!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('tecnicos', 'tecnico_id') tecnico!: Relation<Tecnico>;
  @relation('enderecos', 'endereco_id') endereco!: Relation<Endereco>;
}
