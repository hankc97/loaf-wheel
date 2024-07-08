import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { WheelDetailsModel } from "./wheelDetails";

@Table({
  tableName: "fluffy_wheel",
  deletedAt: false,
  updatedAt: false,
})
export class WheelModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public declare id: string;

  @Column({ field: "created_at", type: DataType.DATE(3), allowNull: false })
  public declare createdAt: Date;

  @Column({ field: "updated_at", type: DataType.DATE(3) })
  public declare updatedAt: Date;

  @Column({ field: "end_timestamp", type: DataType.DATE(3), allowNull: false })
  public declare endTimestamp: Date;

  @Column({ field: "game_state", type: DataType.STRING, allowNull: false })
  public declare gameState: string;

  @HasMany(() => WheelDetailsModel, {
    foreignKey: "gameId",
  })
  public game!: WheelDetailsModel[];

  @Column({ field: "winner_wallet", type: DataType.STRING })
  public declare winnerWallet: string;
}
