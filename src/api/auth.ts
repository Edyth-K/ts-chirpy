import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat,
        exp: iat + expiresIn,
    };
    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload;
    if (!decoded.sub) {
        throw new UnauthorizedError("Invalid token");
    }
    return decoded.sub;
}