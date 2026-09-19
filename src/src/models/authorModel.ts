import type { Author } from "../types";

// In-memory storage. Data is lost when the server restarts.
let authors: Author[] = [];
let nextId = 1;

const findAll = (): Author[] => authors;

const findById = (id: number): Author | undefined => authors.find((a) => a.id === id);

const create = (data: Omit<Author, "id">): Author => {
  const author: Author = { id: nextId++, ...data };
  authors.push(author);
  return author;
};

const update = (id: number, data: Omit<Author, "id">): Author | undefined => {
  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  const updated: Author = { id, ...data };
  authors[index] = updated;
  return updated;
};

const remove = (id: number): void => {
  authors = authors.filter((a) => a.id !== id);
};

export = { findAll, findById, create, update, remove };
