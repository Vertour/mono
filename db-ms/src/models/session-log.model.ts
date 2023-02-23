import { ISessionLog } from 'bizdo';
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'session_logs' })
export class SessionLog extends Model<SessionLog> implements ISessionLog {
  @Column({
    type: DataType.TEXT,
    unique: true,
    primaryKey: true
  })
  token: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING(64), unique: false, allowNull: false, field: 'user_uid' })
  userUid: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  data: ISessionLog['data'];
}
