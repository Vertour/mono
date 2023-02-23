import { IRole } from 'bizdo';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { Permission } from './permission-constants.model';
import { RolePermission } from './role-permission.model';
import { User } from './user.model';
import { Vacancy } from './vacancy.model';

export interface IRoleModel extends IRole {
  permissions?: Permission[];
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role> implements IRoleModel {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(64), allowNull: false })
  name: string;

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'organization_id' })
  organizationId: number;

  @BelongsTo(() => Organization)
  organization?: Organization;

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions?: Permission[];

  @BelongsToMany(() => User, () => Vacancy)
  users: User[];

  @HasMany(() => Vacancy)
  vacancies: Vacancy[];
}
