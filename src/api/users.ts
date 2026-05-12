import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword, makeRefreshToken } from "./auth.js";
import { makeJWT, getBearerToken } from "./auth.js";
import { config } from "../config.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";

export async function handlerCreateUser(req: Request, res: Response) {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
        const { email, password } = JSON.parse(body);
        const hashedPassword = await hashPassword(password);
        const user = await createUser({ email, hashedPassword });
        const { hashedPassword: _, ...userResponse } = user;
        res.status(201).json(userResponse);
    });
}

export async function handlerLogin(req: Request, res: Response) {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
        try {
            const { email, password } = JSON.parse(body);
            const user = await getUserByEmail(email);
            const valid = await checkPasswordHash(password, user.hashedPassword);
            if (!user || !valid) { 
                res.status(401).json({ error: "Incorrect email or password" });
                return;
            }
            const token = makeJWT(user.id, 3600, config.api.jwtSecret);
            const refreshToken = makeRefreshToken();
            await createRefreshToken(refreshToken, user.id);
            const { hashedPassword: _, ...userResponse } = user;
            res.status(200).json({ ...userResponse, token, refreshToken });
        } catch {
            res.status(401).json({ error: "Incorrect email or password" });
        }
    });
}

export async function handlerRefresh(req: Request, res: Response) {
    const tokenString = getBearerToken(req);
    const record = await getRefreshToken(tokenString);
    if (!record || record.revokedAt || record.expiresAt < new Date()) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
    }
    const token = makeJWT(record.userId, 3600, config.api.jwtSecret);
    res.status(200).json({ token });
}

export async function handlerRevoke(req: Request, res: Response) {
    const tokenString = getBearerToken(req);
    await revokeRefreshToken(tokenString);
    res.status(204).send();
}