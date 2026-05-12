import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from "./auth.js";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for the wrong password", async () => {
        const result = await checkPasswordHash(password2, hash1);
        expect(result).toBe(false);
    });
});

describe("JWT", () => {
    const secret = "testsecret";
    const userID = "abc-123";
    let validToken: string;

    beforeAll(() => {
        validToken = makeJWT(userID, 3600, secret);
    });

    it("should validate a valid JWT and return the user ID", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });

    it("should reject an expired token", () => {
        const expiredToken = makeJWT(userID, -1, secret);
        expect(() => validateJWT(expiredToken, secret)).toThrow();
    });

    it("should reject a token signed with the wrong secret", () => {
        expect(() => validateJWT(validToken, "wrongsecret")).toThrow();
    });
});
