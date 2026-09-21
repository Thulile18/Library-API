import type { Author } from "../types";
import HttpError = require("../errors");
import authorModel = require("../models/authorModel");
import bookModel = require("../models/bookModel");
import bookService = require("./bookService");
import q = require("../utils/query");

// Supports: ?name=  ?sort=  ?page=  ?limit=
const list = (query: Record<string, unknown>) => {
  const name = q.getText(query.name);

  let authors = authorModel.getAll();
  if (name) {
    authors = authors.filter((author) => q.contains(author.name, name));
  }

  authors = q.sortItems(authors, query.sort, ["id", "name", "birthYear"]);
  return q.paginate(authors, query.page, query.limit);
};

const getById = (id: number) => {
  const author = authorModel.getById(id);
  if (!author) throw new HttpError(404, "Author not found");
  return author;
};

const create = (data: Omit<Author, "id">) => authorModel.create(data);

const update = (id: number, data: Omit<Author, "id">) => {
  getById(id);
  return authorModel.update(id, data);
};

// An author who still has books cannot be deleted, unless cascade is true.
const remove = (id: number, cascade: boolean) => {
  getById(id);

  const hasBooks = bookModel.getByAuthorId(id).length > 0;
  if (hasBooks && !cascade) {
    throw new HttpError(409, "This author still has books. Delete the books first or use ?cascade=true");
  }

  bookModel.removeByAuthorId(id);
  authorModel.remove(id);
  return { message: "Author deleted" };
};

const listBooks = (id: number, query: Record<string, unknown>) => {
  getById(id);
  return bookService.list(query, id);
};

export = { list, getById, create, update, remove, listBooks };
