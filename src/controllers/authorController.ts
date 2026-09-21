import type { Request, Response } from "express";
import authorService = require("../services/authorService");
import q = require("../utils/query");

const createAuthor = (req: Request, res: Response) => {
  const author = authorService.create(req.body);
  res.status(201).json(author);
};

const getAuthors = (req: Request, res: Response) => {
  res.status(200).json(authorService.list(req.query));
};

const getAuthorById = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(authorService.getById(id));
};

const updateAuthor = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(authorService.update(id, req.body));
};

const deleteAuthor = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  const cascade = req.query.cascade === "true";
  res.status(200).json(authorService.remove(id, cascade));
};

const getBooksByAuthor = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(authorService.listBooks(id, req.query));
};

export = { createAuthor, getAuthors, getAuthorById, updateAuthor, deleteAuthor, getBooksByAuthor };
