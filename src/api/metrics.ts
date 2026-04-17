import { Request, Response } from "express";
import { apiConfig } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
    const currentHitCount = apiConfig.fileserverHits;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${currentHitCount}`);
}