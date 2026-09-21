import type { Request, Response } from "express";
import bookService = require("../services/bookService");
import q = require("../utils/query");

const createBook = (req: Request, res: Response) => {
  const book = bookService.create(req.body);
  res.status(201).json(book);
};

const getBooks = (req: Request, res: Response) => {
  res.status(200).json(bookService.list(req.query));
};

const getBookById = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(bookService.getById(id));
};

const updateBook = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(bookService.update(id, req.body));
};

const deleteBook = (req: Request, res: Response) => {
  const id = q.parseId(req.params.id);
  res.status(200).json(bookService.remove(id));
};

export = { createBook, getBooks, getBookById, updateBook, deleteBook };
