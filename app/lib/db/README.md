# Database Management (Postgres)

## How it Works

The `src/db/` folder contains a `migrations` directory.

Within this directory are namespaced client directories, e.g. `superfans`.

Each client directory will contain migrations specific to that client.

The migrations are handled in code, allowing for traceability into what is being generated, what has already been migrated, and supports an ordering for undoing migrations.

By default, migrations are tracked within postgres in a new table `$CLIENT_migrations` (e.g. `superfans_migrations`).

The migrations use the `sequelize` QueryInterace, which adds some nice functionality on top of raw SQL, however raw SQL can be used as well.

## Setup

Ensure you have the proper permissions to the database, specified in one of the following environmental ways:

1. `DB_SETTINGS` - a JSON stringified value containing the host/username/password
2. One-off environment variables, `DB_USER`, `DB_PASS`, `DB_HOST`

## Creating a Migration

```bash
yarn db:gen -c superfans discord-users
# or
# ts-node ./src/db/cli.ts gen -c superfans discord-users
```

This will create a file within the `srd/db/migrations/superfans` directory containing a skeleton file with 2 exported functions:

1. `up` - all operations run upon a migration (e.g. creating tables, indexes, etc.)
2. `down` - all operations to undo the migration (e.g. dropTable, dropIndex, etc.)

**NOTE** - use the provided transaction to couple multiple operations together

## Migrating

Once your migration files are created, you can migrate these changes to the database, as follows:

```bash
yarn db:migrate -c superfans
# or
# ts-node ./src/db/cli.ts migrate -c superfans
```

## Undoing a Migration

If you want to undo the last migration for a client:

```bash
yarn db:undo -c superfans
# or
# ts-node ./src/db/cli.ts undo -c superfans
```

This command can be run multiple times.

## CLI Usage

```shell
cli.ts <command> [...args]

    <command>                       the command to run (required)
      generate | gen <name>         generate a new migration file
        <name>                      the name of the migration
      migrate                       run all pending migrations
      undo                          undo the last migration

    --help | -h                     display help information
    --client | -c                   specify the client to use (required)
    --migrations-table              specify the migrations table name (default: YOUR_CLIENT_migrations)
```
