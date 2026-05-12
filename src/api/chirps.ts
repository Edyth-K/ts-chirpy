import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

const profaneWords = ["kerfuffle", "sharbert", "fornax"];

function cleanBody(text: string): string {
    return text.split(" ").map(word =>
        profaneWords.includes(word.toLowerCase()) ? "****" : word
    ).join(" ");
}

export async function handlerCreateChirp(req: Request, res: Response) {
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", chunk => body += chunk);

  // 3. Listen for end events
  req.on("end", async () => {
    res.header("Content-Type", "application/json");
    try {
      const token = getBearerToken(req);
      const userId = validateJWT(token, config.api.jwtSecret);
      const { body: chirpBody } = JSON.parse(body);
      if (chirpBody.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
      }
      const cleanedBody = cleanBody(chirpBody);
      const chirp = await createChirp({ body: cleanedBody, userId });
      res.status(201).json(chirp);
    } catch (error) {
        if (error instanceof BadRequestError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof UnauthorizedError) {
          res.status(401).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: "Something went wrong on our end" });
        }
    }

  });
}

export async function handlerGetChirps(req: Request, res: Response) {
  const allChirps = await getAllChirps();
  res.status(200).json(allChirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const chirp = await getChirpById(req.params.chirpId as string);
  if (!chirp) {
    res.status(404).json({ error: "Chirp not found" });
    return;
  }
  res.status(200).json(chirp);
}