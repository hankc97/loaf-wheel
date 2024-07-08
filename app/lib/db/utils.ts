import { QueryInterface, Transaction } from "sequelize";

export const addUpdatedAtTrigger = async ({
  tableName,
  triggerFunctionName,
  queryInterface,
  transaction,
}: {
  tableName: string;
  triggerFunctionName: string;
  queryInterface: QueryInterface;
  transaction: Transaction;
}) =>
  await queryInterface.createTrigger(
    tableName,
    `trg_${tableName}_updated_at`,
    "before",
    // @ts-ignore - https://github.com/sequelize/sequelize/issues/11420
    { before: "update" },
    triggerFunctionName,
    [],
    ["FOR EACH ROW"],
    { transaction },
  );

// export const addStandardTablePermissions = async ({
//   tableName,
//   queryInterface,
//   transaction,
// }: {
//   tableName: string;
//   queryInterface: QueryInterface;
//   transaction: Transaction;
// }) => {
//   await queryInterface.sequelize.query(
//     `alter table public.${tableName} owner to postgres`,
//     { transaction },
//   );
//   await queryInterface.sequelize.query(
//     `grant delete, insert, select, update on public.${tableName} to readonly`,
//     {
//       transaction,
//     },
//   );
//   await queryInterface.sequelize.query(
//     `grant delete, insert, references, select, trigger, truncate, update on public.${tableName} to refresh`,
//     { transaction },
//   );
//   await queryInterface.sequelize.query(
//     `grant delete, insert, select, update on public.${tableName} to dev`,
//     {
//       transaction,
//     },
//   );
// };
