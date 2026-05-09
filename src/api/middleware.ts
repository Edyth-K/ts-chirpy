import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "../errors.js";

const customErrors = [BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError];

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    const custom = customErrors.find(e => err instanceof e);
    if (custom) {
        res.status((err as any).statusCode).json({ error: err.message });
    } else {
        console.log(err);
        res.status(500).json({ error: "Something went wrong on our end" });
    }
}


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
    config.api.fileserverHits += 1;
    next();
}
