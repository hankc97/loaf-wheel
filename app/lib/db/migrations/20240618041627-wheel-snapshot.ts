import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

const TABLE_NAME = "fluffy_wheel_snapshot";

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      TABLE_NAME,
      {
        id: {
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        created_at: {
          type: DataType.DATE(3),
          allowNull: false,
        },
        updated_at: {
          type: DataType.DATE(3),
          allowNull: true,
        },
        wallet_id: {
          type: DataType.STRING,
          allowNull: false,
        },
        deposit_amount: {
          type: DataType.DECIMAL(10, 4),
          allowNull: false,
        },
        game_id: {
          type: DataType.STRING,
          allowNull: false,
        },
      },
      { transaction }
    );
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable(TABLE_NAME, { transaction });
  });
};
