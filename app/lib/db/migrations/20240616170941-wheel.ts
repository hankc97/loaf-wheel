import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

const TABLE_NAME = "fluffy_wheel";

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
        end_timestamp: {
          type: DataType.DATE(3),
          allowNull: false,
        },
        game_state: {
          type: DataType.STRING,
          allowNull: false,
        },
        winner_wallet: {
          type: DataType.STRING,
          allowNull: true,
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
