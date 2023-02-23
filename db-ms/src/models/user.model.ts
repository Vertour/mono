import { IAccount, IImage } from 'bizdo';
import sequelize from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { Password } from './password.model';
import { Role } from './role.model';
import { Vacancy } from './vacancy.model';

export interface IUserModel extends IAccount {
  password?: Password;
  organizations?: Organization[];
  vacancies: Vacancy[];
}

@Table({ tableName: 'users' })
export class User extends Model<User> implements IUserModel {
  @Column({
    type: DataType.UUID,
    defaultValue: sequelize.fn('gen_random_uuid'),
    unique: true,
    primaryKey: true
  })
  uid: string;

  @Column({ type: DataType.STRING(64), unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(32), allowNull: false, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING(32), allowNull: false, field: 'last_name' })
  lastName: string;

  @Column({ type: DataType.STRING(32), allowNull: true, field: 'middle_name', defaultValue: '' })
  middleName: string;

  @Column({ type: DataType.STRING(14), unique: true, allowNull: true })
  phone: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  image: IImage;

  @HasOne(() => Password)
  password: Password;

  @HasMany(() => Vacancy)
  vacancies: Vacancy[];

  @BelongsToMany(() => Role, () => Vacancy)
  roles: Role[];

  organizations: Organization[];
}
