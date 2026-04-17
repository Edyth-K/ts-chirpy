import { Request, Response } from "express";
import { apiConfig } from "../config.js";

export function handlerReset(req: Request, res: Response) {
    apiConfig.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200);
    res.send(`OK`);
}