import { Request, Response, NextFunction } from "express";
import { apiConfig } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        } 
    })
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    apiConfig.fileserverHits += 1;
    next();
}