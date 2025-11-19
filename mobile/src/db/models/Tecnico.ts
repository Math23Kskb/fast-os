import { Model, Query, Relation } from '@nozbe/watermelondb';
import {
  field,
  text,
  readonly,
  date,
  children,
} from '@nozbe/watermelondb/decorators';
import Visita from './Visita';

export default class Tecnico extends Model {
  static override table = 'tecnicos';

  static override associations = {
    visitas: { type: 'has_many', foreignKey: 'tecnico_id' },
  } as const;

  @text('nome') nome!: string;
  @field('matricula') matricula!: string;
  @field('ativo') ativo!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('visitas') visitas!: Query<Visita>;
}
