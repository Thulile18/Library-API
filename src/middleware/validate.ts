import type { NextFunction, Request, Response } from "express";
import HttpError = require("../errors");

const isText = (value: unknown) => typeof value === "string" && value.trim() !== "";

// Runs before POST and PUT on /authors.
function validateAuthor(req: Request, res: Response, next: NextFunction) {
  const { name, birthYear } = req.body ?? {};
  const problems: string[] = [];

  if (!isText(name)) problems.push("name is required");
  if (birthYear !== undefined && !Number.isInteger(birthYear)) {
    problems.push("birthYear must be a whole number");
  }
  if (problems.length > 0) throw new HttpError(400, problems.join(", "));

  // Keep only the fields we know about
  const author: { name: string; birthYear?: number } = { name: name.trim() };
  if (birthYear !== undefined) author.birthYear = birthYear;
  req.body = author;
  next();
}

// Runs before POST and PUT on /books.
function validateBook(req: Request, res: Response, next: NextFunction) {
  const { title, authorId, year } = req.body ?? {};
  const problems: string[] = [];

  if (!isText(title)) problems.push("title is required");
  if (!Number.isInteger(authorId)) problems.push("authorId is required and must be a whole number");
  if (!Number.isInteger(year)) problems.push("year is required and must be a whole number");
  if (problems.length > 0) throw new HttpError(400, problems.join(", "));

  // Keep only the fields we know about
  req.body = { title: title.trim(), authorId, year };
  next();
}

export = { validateAuthor, validateBook };
