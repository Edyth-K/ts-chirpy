import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "./auth.js";
import { makeJWT } from "./auth.js";
import { config } from "../config.js";

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
            const { email, password, expiresInSeconds } = JSON.parse(body);
            const user = await getUserByEmail(email);
            const valid = await checkPasswordHash(password, user.hashedPassword);
            if (!user || !valid) { 
                res.status(401).json({ error: "Incorrect email or password" });
                return;
            }
            const maxExpiry = 3600;
            const expiresIn = Math.min(expiresInSeconds ?? maxExpiry, maxExpiry);
            const token = makeJWT(user.id, expiresIn, config.api.jwtSecret);
            const { hashedPassword: _, ...userResponse } = user;
            res.status(200).json({ ...userResponse, token });
        } catch {
            res.status(401).json({ error: "Incorrect email or password" });
        }
    });
}
