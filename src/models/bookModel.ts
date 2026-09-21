import type { Book } from "../types";

// The "database": a plain array. Data is lost when the server restarts.
let books: Book[] = [];
let nextId = 1;

const getAll = () => books;

const getById = (id: number) => books.find((book) => book.id === id);

const getByAuthorId = (authorId: number) => books.filter((book) => book.authorId === authorId);

// Finds a book with the same title (ignoring upper/lower case) by the same author.
const findDuplicate = (title: string, authorId: number, ignoreId?: number) =>
  books.find(
    (book) =>
      book.id !== ignoreId &&
      book.authorId === authorId &&
      book.title.toLowerCase() === title.toLowerCase()
  );

const create = (data: Omit<Book, "id">) => {
  const book = { id: nextId, ...data };
  nextId++;
  books.push(book);
  return book;
};

const update = (id: number, data: Omit<Book, "id">) => {
  const index = books.findIndex((book) => book.id === id);
  const updated = { id, ...data };
  books[index] = updated;
  return updated;
};

const remove = (id: number) => {
  books = books.filter((book) => book.id !== id);
};

const removeByAuthorId = (authorId: number) => {
  books = books.filter((book) => book.authorId !== authorId);
};

export = { getAll, getById, getByAuthorId, findDuplicate, create, update, remove, removeByAuthorId };
