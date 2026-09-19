import type { Book } from "../types";
import HttpError = require("../errors");
import authorModel = require("../models/authorModel");
import bookModel = require("../models/bookModel");
import q = require("../utils/query");

/*
 Filtering supported (all optional, combinable):
  title=...      partial, case-insensitive
  author=...     partial author name, case-insensitive
  authorId=...   exact
  year=...       exact
  yearFrom / yearTo   inclusive range
  search=...     matches title, author name or isbn
  sort=title|year|id|authorId (prefix - for descending), page, limit
*/
const list = (query: Record<string, unknown>, forcedAuthorId?: number) => {
  const title = q.getString(query.title);
  const authorName = q.getString(query.author);
  const authorId = forcedAuthorId ?? q.getInt(query.authorId, "authorId");
  const year = q.getInt(query.year, "year");
  const yearFrom = q.getInt(query.yearFrom, "yearFrom");
  const yearTo = q.getInt(query.yearTo, "yearTo");
  const search = q.getString(query.search);

  const nameOf = (id: number) => authorModel.findById(id)?.name;

  const filtered = bookModel.findAll().filter((b) => {
    if (authorId !== undefined && b.authorId !== authorId) return false;
    if (title && !q.contains(b.title, title)) return false;
    if (authorName && !q.contains(nameOf(b.authorId), authorName)) return false;
    if (year !== undefined && b.year !== year) return false;
    if (yearFrom !== undefined && b.year < yearFrom) return false;
    if (yearTo !== undefined && b.year > yearTo) return false;
    if (
      search &&
      !(q.contains(b.title, search) || q.contains(nameOf(b.authorId), search) || q.contains(b.isbn, search))
    )
      return false;
    return true;
  });

  return q.sortAndPaginate(filtered, query, ["id", "title", "year", "authorId"]);
};

const getById = (id: number): Book => {
  const book = bookModel.findById(id);
  if (!book) throw HttpError.notFound(`Book with id ${id} not found`);
  return book;
};

// Business rule 1: a book must reference an existing author.
const assertAuthorExists = (authorId: number) => {
  if (!authorModel.findById(authorId))
    throw HttpError.badRequest("Validation failed", [
      `authorId ${authorId} does not reference an existing author`,
    ]);
};

// Business rule 2: the same title by the same author can't be added twice.
const assertNotDuplicate = (title: string, authorId: number, ignoreId?: number) => {
  if (bookModel.findDuplicate(title, authorId, ignoreId))
    throw HttpError.conflict(`A book titled "${title}" by author ${authorId} already exists`);
};

const create = (data: Omit<Book, "id">) => {
  assertAuthorExists(data.authorId);
  assertNotDuplicate(data.title, data.authorId);
  return bookModel.create(data);
};

const update = (id: number, data: Omit<Book, "id">) => {
  getById(id); // 404 if missing
  assertAuthorExists(data.authorId);
  assertNotDuplicate(data.title, data.authorId, id);
  return bookModel.update(id, data);
};

const remove = (id: number) => {
  const book = getById(id);
  bookModel.remove(id);
  return { message: "Book deleted", book };
};

export = { list, getById, create, update, remove };
