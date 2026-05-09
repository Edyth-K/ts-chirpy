import { Request, Response } from "express";
import { BadRequestError } from "../errors.js";

const profaneWords = ["kerfuffle", "sharbert", "fornax"];

function cleanBody(text: string): string {
    return text.split(" ").map(word =>
        profaneWords.includes(word.toLowerCase()) ? "****" : word
    ).join(" ");
}

export function handlerValidateChirp(req: Request, res: Response) {
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 3. Listen for end events
  req.on("end", () => {
    res.header("Content-Type", "application/json");
    try {
      const parsedBody = JSON.parse(body);
      if (parsedBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
      }
      const cleanedBody = cleanBody(parsedBody.body);
      res.status(200).send(JSON.stringify({ cleanedBody }));
    } catch (error) {
        if (error instanceof BadRequestError) {
            res.status(400).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: "Something went wrong on our end" });
        }
    }

  });
}