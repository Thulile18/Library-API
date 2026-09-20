import type { NextFunction, Request, Response } from "express";
import HttpError = require("../errors");

// Runs when no route matched the request.
function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Every error in the app ends up here and leaves as the same JSON shape.
function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Errors we threw on purpose (400, 404, 409)
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { status: err.status, message: err.message, details: err.details },
    });
    return;
  }

  // The client sent broken JSON
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ error: { status: 400, message: "Malformed JSON in request body" } });
    return;
  }

  // The client sent a body that is too big (Express allows 100kb by default)
  if (err.type === "entity.too.large") {
    res.status(413).json({ error: { status: 413, message: "Request body is too large" } });
    return;
  }

  // Anything unexpected: log it for us, but don't show details to the client
  console.error(err);
  res.status(500).json({ error: { status: 500, message: "Internal server error" } });
}

export = { notFoundHandler, errorHandler };