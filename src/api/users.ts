import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
        const { email } = JSON.parse(body);
        const user = await createUser({ email });
        res.status(201).json(user);
    });
}
