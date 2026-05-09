import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        res.status(403).json({ error: "Forbidden" });
        return;
    }
    
    await deleteAllUsers();
    config.api.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(`OK`);
}