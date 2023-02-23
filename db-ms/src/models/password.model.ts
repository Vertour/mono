import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export interface iPasswordModel {
  userUid: string;
  hash: string;
  salt: string;
}

@Table({ tableName: 'garbage', createdAt: false })
export class Password extends Model<Password> implements iPasswordModel {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, primaryKey: true, field: 'user_uid' })
  userUid: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  hash: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  salt: string;

  @BelongsTo(() => User)
  user: User;
}
