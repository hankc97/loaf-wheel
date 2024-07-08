import dotenv from "dotenv";
import * as fs from "fs-extra";
import minimist from "minimist";
import path from "node:path";
import * as pc from "picocolors";

import { QueryInterface } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import sequelize from "../sequelize";
import { UmzugLogger } from "../umzug-logger";
import { Log } from "../../logging/logging";

dotenv.config();

const scriptName = path.basename(__filename);
const baseMigrationsDir = path.join(__dirname, "../", "migrations");

const DEFAULT_MIGRATIONS_TABLE_SUFFIX = "_migrations";

const logger = new Log(scriptName);
const DEFAULT_CLIENT = "degen_legend";

const printUsage = (message?: string) => {
  console.log(`${scriptName} <command> [...args]

    <command>                       the command to run (required)
      generate | gen <name>         generate a new migration file
        <name>                      the name of the migration
      migrate                       run all pending migrations
      undo                          undo the last migration

    --help | -h                     display help information
    --client | -c                   specify the client to use (default: ${DEFAULT_CLIENT})
    --migrations-table              specify the migrations table name (default: YOUR_CLIENT${DEFAULT_MIGRATIONS_TABLE_SUFFIX})
`);
  if (message) {
    console.error(pc.red(message));
  }
};

const generateMigration = async (client: string, name: string) => {
  // this date prefix matches what sequelize-cli generates
  const datePrefix = new Date().toJSON().replace(/[-:T]/g, "").split(/[.]/)[0];

  const suggestedTableName = `${client}_${name}`
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();

  // the skeleton file we want to write
  const skeletonFile = `import { QueryInterface } from "sequelize";
import { DataType } from 'sequelize-typescript';

const TABLE_NAME = "${suggestedTableName}";

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
                // TODO add more fields here
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
`;

  const filename = path.join(baseMigrationsDir, `${datePrefix}-${name}.ts`);

  await fs.outputFile(filename, skeletonFile);
  logger.info(pc.green(`Created migration file: ${filename}`));
};

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  const args =
    argv._.length && __filename === path.resolve(argv._[0])
      ? argv._.slice(1)
      : argv._;

  if (argv.help || argv.h) {
    printUsage();
  } else {
    const command = args.shift();
    if (!command) {
      printUsage("Missing command");
      return;
    }
    const client = argv.client || argv.c || DEFAULT_CLIENT;
    if (!client) {
      printUsage("Missing client name");
      return;
    }

    if (command === "generate" || command === "gen") {
      const name = args.shift();
      if (!name) {
        printUsage("Missing migration name");
      } else {
        generateMigration(client, name);
      }
    } else if (command === "migrate" || command === "undo") {
      const migrationsDir = path.join(baseMigrationsDir);
      const migrationsTable =
        argv["migrations-table"] ||
        `${client}${DEFAULT_MIGRATIONS_TABLE_SUFFIX}`;
      const umzug = new Umzug({
        migrations: {
          glob: ["*.ts", { cwd: migrationsDir }],
          resolve: ({ path, name, context }) => {
            if (!path) {
              throw new Error(`Migration file not found: ${name}`);
            }

            // log the migration info, similar to how sequelize-cli does
            const logAndRunMigration = async (
              func: (s: QueryInterface) => Promise<void>,
              isUp?: boolean,
            ) => {
              const start = new Date().getTime();
              logger.info(
                pc.blue(`== ${name}: ${isUp ? "migrating" : "reverting"} ==`),
              );
              await func(context);
              const diffSeconds = (new Date().getTime() - start) / 1000;
              logger.info(
                pc.blue(
                  `== ${name}: ${
                    isUp ? "migrated" : "reverted"
                  } (${diffSeconds.toFixed(3)}s)`,
                ),
              );
            };

            const { up, down } = require(path) as {
              up: (s: QueryInterface) => Promise<void>;
              down: (s: QueryInterface) => Promise<void>;
            };
            return {
              name: name,
              up: async () => logAndRunMigration(up, true),
              down: async () => logAndRunMigration(down),
            };
          },
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({
          sequelize,
          tableName: migrationsTable,
        }),
        logger: new UmzugLogger(logger),
      });

      if (command === "undo") {
        logger.info(pc.green(`🔨 Undoing last migration`));
        await umzug.down();
      } else {
        logger.info(pc.green(`🔨 Running migrations`));
        await umzug.up();
      }
    } else {
      printUsage(`Unknown command: ${command}`);
    }
  }
};

main().catch((e) => {
  logger.error(pc.red(e));
  process.exit(1);
});
