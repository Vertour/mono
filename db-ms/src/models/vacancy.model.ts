import { IVacancy } from 'bizdo';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

export interface IVacancyModel extends IVacancy {}

@Table({ tableName: 'vacancies' })
export class Vacancy extends Model<Vacancy> implements IVacancyModel {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(64), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  email: string;

  @Column({ type: DataType.STRING(14), allowNull: true })
  phone: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'role_id' })
  roleId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true, field: 'user_uid' })
  userUid: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => User)
  user: User;
}
