import type { Request, Response } from "express";
import bookService = require("../services/bookService");
import q = require("../utils/query");

const createBook = (req: Request, res: Response) => {
  res.status(201).json(bookService.create(req.body));
};

const getBooks = (req: Request, res: Response) => {
  res.status(200).json(bookService.list(req.query));
};

const getBookById = (req: Request, res: Response) => {
  res.status(200).json(bookService.getById(q.parseId(req.params.id)));
};

const updateBook = (req: Request, res: Response) => {
  res.status(200).json(bookService.update(q.parseId(req.params.id), req.body));
};

const deleteBook = (req: Request, res: Response) => {
  res.status(200).json(bookService.remove(q.parseId(req.params.id)));
};

export = { createBook, getBooks, getBookById, updateBook, deleteBook };
