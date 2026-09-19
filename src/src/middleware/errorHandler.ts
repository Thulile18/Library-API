import type { NextFunction, Request, Response } from "express";
import HttpError = require("../errors");

function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler: every error leaves the API in the same JSON shape.
function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { status: err.status, message: err.message, ...(err.details && { details: err.details }) },
    });
    return;
  }
  // Malformed JSON from express.json()
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: { status: 400, message: "Malformed JSON in request body" } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { status: 500, message: "Internal server error" } });
}

export = { notFoundHandler, errorHandler };
