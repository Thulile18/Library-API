import type { Author } from "../types";
import HttpError = require("../errors");
import authorModel = require("../models/authorModel");
import bookModel = require("../models/bookModel");
import bookService = require("./bookService");
import q = require("../utils/query");

const list = (query: Record<string, unknown>) => {
  const name = q.getString(query.name);
  const all = authorModel.findAll();
  const filtered = name ? all.filter((a) => q.contains(a.name, name)) : all;
  return q.sortAndPaginate(filtered, query, ["id", "name", "birthYear"]);
};

const getById = (id: number): Author => {
  const author = authorModel.findById(id);
  if (!author) throw HttpError.notFound(`Author with id ${id} not found`);
  return author;
};

const create = (data: Omit<Author, "id">) => authorModel.create(data);

const update = (id: number, data: Omit<Author, "id">) => {
  getById(id); // 404 if missing
  return authorModel.update(id, data);
};

// Business rule: an author who still has books can't be deleted, unless cascade is true.
const remove = (id: number, cascade: boolean) => {
  const author = getById(id);
  const owned = bookModel.findByAuthorId(id);
  if (owned.length > 0 && !cascade) {
    throw HttpError.conflict(
      `Author ${id} still has ${owned.length} book(s). Delete them first or use ?cascade=true`
    );
  }
  bookModel.removeByAuthorId(id);
  authorModel.remove(id);
  return { message: "Author deleted", author, booksDeleted: owned.length };
};

const listBooks = (id: number, query: Record<string, unknown>) => {
  getById(id); // 404 if the author doesn't exist
  return bookService.list(query, id);
};

export = { list, getById, create, update, remove, listBooks };
