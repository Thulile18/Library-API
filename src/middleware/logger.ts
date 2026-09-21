import type { NextFunction, Request, Response } from "express";

// Logs the method and URL of every request.
function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

export = logger;
