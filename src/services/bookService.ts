import type { Book } from "../types";
import HttpError = require("../errors");
import authorModel = require("../models/authorModel");
import bookModel = require("../models/bookModel");
import q = require("../utils/query");

// Business rule 1: a book must belong to an author that exists.
const checkAuthorExists = (authorId: number) => {
  if (!authorModel.getById(authorId)) {
    throw new HttpError(400, "authorId does not match any author");
  }
};

// Business rule 2: the same author cannot have two books with the same title.
const checkNotDuplicate = (title: string, authorId: number, ignoreId?: number) => {
  if (bookModel.findDuplicate(title, authorId, ignoreId)) {
    throw new HttpError(409, "This author already has a book with that title");
  }
};

// Supports: ?title=  ?author=  ?year=  ?sort=  ?page=  ?limit=
// authorId is only used by GET /authors/:id/books
const list = (query: Record<string, unknown>, authorId?: number) => {
  const title = q.getText(query.title);
  const authorName = q.getText(query.author);
  const year = q.toNumber(query.year, "year");

  let books = bookModel.getAll();

  if (authorId !== undefined) {
    books = books.filter((book) => book.authorId === authorId);
  }
  if (title) {
    books = books.filter((book) => q.contains(book.title, title));
  }
  if (authorName) {
    books = books.filter((book) => {
      const author = authorModel.getById(book.authorId);
      return author !== undefined && q.contains(author.name, authorName);
    });
  }
  if (year !== undefined) {
    books = books.filter((book) => book.year === year);
  }

  books = q.sortItems(books, query.sort, ["id", "title", "year"]);
  return q.paginate(books, query.page, query.limit);
};

const getById = (id: number) => {
  const book = bookModel.getById(id);
  if (!book) throw new HttpError(404, "Book not found");
  return book;
};

const create = (data: Omit<Book, "id">) => {
  checkAuthorExists(data.authorId);
  checkNotDuplicate(data.title, data.authorId);
  return bookModel.create(data);
};

const update = (id: number, data: Omit<Book, "id">) => {
  getById(id);
  checkAuthorExists(data.authorId);
  checkNotDuplicate(data.title, data.authorId, id);
  return bookModel.update(id, data);
};

const remove = (id: number) => {
  getById(id);
  bookModel.remove(id);
  return { message: "Book deleted" };
};

export = { list, getById, create, update, remove };
