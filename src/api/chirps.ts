import { Request, Response } from "express";

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
        throw new Error("Chirp is too long");
      }
      const cleanedBody = cleanBody(parsedBody.body);
      res.status(200).send(JSON.stringify({ cleanedBody }));
    } catch (error) {
      res.status(500).json({ error: "Something went wrong on our end" });
    }
  });
}