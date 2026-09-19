import type { Book } from "../types";

// In-memory storage. Data is lost when the server restarts.
let books: Book[] = [];
let nextId = 1;

const findAll = (): Book[] => books;

const findById = (id: number): Book | undefined => books.find((b) => b.id === id);

const findByAuthorId = (authorId: number): Book[] => books.filter((b) => b.authorId === authorId);

// Same title (case-insensitive) by the same author
const findDuplicate = (title: string, authorId: number, ignoreId?: number): Book | undefined =>
  books.find(
    (b) => b.id !== ignoreId && b.authorId === authorId && b.title.toLowerCase() === title.toLowerCase()
  );

const create = (data: Omit<Book, "id">): Book => {
  const book: Book = { id: nextId++, ...data };
  books.push(book);
  return book;
};

const update = (id: number, data: Omit<Book, "id">): Book | undefined => {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;
  const updated: Book = { id, ...data };
  books[index] = updated;
  return updated;
};

const remove = (id: number): void => {
  books = books.filter((b) => b.id !== id);
};

const removeByAuthorId = (authorId: number): void => {
  books = books.filter((b) => b.authorId !== authorId);
};

export = { findAll, findById, findByAuthorId, findDuplicate, create, update, remove, removeByAuthorId };
