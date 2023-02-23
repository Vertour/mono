import { IImage, IOrganization } from 'bizdo';
import { Table, Column, Model, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

export interface IOrganizationModel extends IOrganization {
  users?: User[];
  roles?: Role[];
}

@Table({ tableName: 'organizations' })
export class Organization extends Model<Organization> implements IOrganizationModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING(64), allowNull: false })
  name: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  image: IImage;

  @HasMany(() => Role)
  roles?: Role[];

  users?: User[];
}
