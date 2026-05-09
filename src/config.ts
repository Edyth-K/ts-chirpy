type APIConfig = {
    fileserverHits: number;
    dbURL: string;
}

export const apiConfig: APIConfig = {
    fileserverHits: 0,
    dbURL: process.env.DB_URL ?? "",
};