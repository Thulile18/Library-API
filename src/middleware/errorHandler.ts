import type { NextFunction, Request, Response } from "express";

// Runs when no route matched the URL.
function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ error: "Route not found" });
}

// Every error in the app ends up here and is sent back as JSON.
// Errors we throw (HttpError) and errors from Express itself (bad JSON,
// body too big) already have a status code, so we use it.
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }

  if (err.status && err.status < 500) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Anything unexpected: log it, but don't show details to the client
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
}

export = { notFoundHandler, errorHandler };
