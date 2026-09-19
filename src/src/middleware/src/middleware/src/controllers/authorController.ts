import type { Request, Response } from "express";
import authorService = require("../services/authorService");
import q = require("../utils/query");

const createAuthor = (req: Request, res: Response) => {
  res.status(201).json(authorService.create(req.body));
};

const getAuthors = (req: Request, res: Response) => {
  res.status(200).json(authorService.list(req.query));
};

const getAuthorById = (req: Request, res: Response) => {
  res.status(200).json(authorService.getById(q.parseId(req.params.id)));
};

const updateAuthor = (req: Request, res: Response) => {
  res.status(200).json(authorService.update(q.parseId(req.params.id), req.body));
};

const deleteAuthor = (req: Request, res: Response) => {
  const cascade = req.query.cascade === "true";
  res.status(200).json(authorService.remove(q.parseId(req.params.id), cascade));
};

const getBooksByAuthor = (req: Request, res: Response) => {
  res.status(200).json(authorService.listBooks(q.parseId(req.params.id), req.query));
};

export = { createAuthor, getAuthors, getAuthorById, updateAuthor, deleteAuthor, getBooksByAuthor };
