import { IPermission } from 'bizdo';
import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';
import { Role } from './role.model';

export interface IPermissionModel extends IPermission {}

@Table({ tableName: 'permissions_constants', timestamps: false })
export class Permission extends Model<Permission> implements IPermissionModel {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(64), allowNull: false })
  name: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles?: Role[];
}
