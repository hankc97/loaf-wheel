import {
  BelongsTo,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { WheelModel } from "./wheel";

@Table({
  tableName: "fluffy_wheel_details",
  deletedAt: false,
  updatedAt: false,
})
export class WheelDetailsModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public declare id: string;

  @Column({ field: "created_at", type: DataType.DATE(3), allowNull: false })
  public declare createdAt: Date;

  @Column({ field: "updated_at", type: DataType.DATE(3) })
  public declare updatedAt: Date;

  @Column({ field: "wallet_id", type: DataType.STRING, allowNull: false })
  public declare walletId: string;

  @Column({
    field: "deposit_amount",
    type: DataType.DECIMAL(10, 4),
    allowNull: false,
  })
  public declare depositAmount: number;

  @Column({ field: "game_id", type: DataType.UUID, allowNull: false })
  public declare gameId: string;

  @BelongsTo(() => WheelModel, { foreignKey: "gameId", targetKey: "id" })
  public declare game: WheelModel;
}
