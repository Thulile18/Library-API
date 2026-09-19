import type { NextFunction, Request, Response } from "express";
import HttpError = require("../errors");

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isNonEmptyString = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;

const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v);

// Used for both POST and PUT on /authors (PUT is a full replacement).
function validateAuthor(req: Request, _res: Response, next: NextFunction) {
  const body: unknown = req.body;
  if (!isObject(body)) throw HttpError.badRequest("Request body must be a JSON object");

  const problems: string[] = [];
  const thisYear = new Date().getFullYear();

  if (body.name === undefined) problems.push("name is required");
  else if (!isNonEmptyString(body.name, 100))
    problems.push("name must be a non-empty string (max 100 characters)");

  if (body.bio !== undefined && !(typeof body.bio === "string" && body.bio.length <= 1000))
    problems.push("bio must be a string (max 1000 characters)");

  if (
    body.birthYear !== undefined &&
    !(isInt(body.birthYear) && body.birthYear >= 0 && body.birthYear <= thisYear)
  )
    problems.push(`birthYear must be an integer between 0 and ${thisYear}`);

  if (problems.length) throw HttpError.badRequest("Validation failed", problems);

  const clean: Record<string, unknown> = { name: (body.name as string).trim() };
  if (body.bio !== undefined) clean.bio = body.bio;
  if (body.birthYear !== undefined) clean.birthYear = body.birthYear;
  req.body = clean;
  next();
}

// Used for both POST and PUT on /books (PUT is a full replacement).
function validateBook(req: Request, _res: Response, next: NextFunction) {
  const body: unknown = req.body;
  if (!isObject(body)) throw HttpError.badRequest("Request body must be a JSON object");

  const problems: string[] = [];
  const maxYear = new Date().getFullYear() + 1;

  if (body.title === undefined) problems.push("title is required");
  else if (!isNonEmptyString(body.title, 200))
    problems.push("title must be a non-empty string (max 200 characters)");

  if (body.authorId === undefined) problems.push("authorId is required");
  else if (!(isInt(body.authorId) && body.authorId > 0))
    problems.push("authorId must be a positive integer");

  if (body.year === undefined) problems.push("year is required");
  else if (!(isInt(body.year) && body.year >= 0 && body.year <= maxYear))
    problems.push(`year must be an integer between 0 and ${maxYear}`);

  if (body.isbn !== undefined && !isNonEmptyString(body.isbn, 20))
    problems.push("isbn must be a non-empty string (max 20 characters)");

  if (problems.length) throw HttpError.badRequest("Validation failed", problems);

  const clean: Record<string, unknown> = {
    title: (body.title as string).trim(),
    authorId: body.authorId,
    year: body.year,
  };
  if (body.isbn !== undefined) clean.isbn = (body.isbn as string).trim();
  req.body = clean;
  next();
}

export = { validateAuthor, validateBook };
