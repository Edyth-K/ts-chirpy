import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
    fileserverHits: number;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

export const config = {
    api: {
        fileserverHits: 0,
    } as APIConfig,
    db: {
        url: process.env.DB_URL ?? "",
        migrationConfig: {
            migrationsFolder: "./src/db/migrations",
        },
    } as DBConfig,
};