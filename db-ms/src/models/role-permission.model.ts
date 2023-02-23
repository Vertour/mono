import { IImage, IRolePermission } from 'bizdo';
import { Table, Column, Model, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { Permission } from './permission-constants.model';
import { Role } from './role.model';

export interface IRolePermissionModel extends IRolePermission {
  //vacancies: Vacancy[];
}

@Table({ tableName: 'role_permissions' })
export class RolePermission extends Model<RolePermission> implements IRolePermissionModel {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'role_id' })
  roleId: number;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'permission_id' })
  permissionId: number;
}
