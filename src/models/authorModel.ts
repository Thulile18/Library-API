import type { Author } from "../types";

// The "database": a plain array. Data is lost when the server restarts.
let authors: Author[] = [];
let nextId = 1;

const getAll = () => authors;

const getById = (id: number) => authors.find((author) => author.id === id);

const create = (data: Omit<Author, "id">) => {
  const author = { id: nextId, ...data };
  nextId++;
  authors.push(author);
  return author;
};

const update = (id: number, data: Omit<Author, "id">) => {
  const index = authors.findIndex((author) => author.id === id);
  const updated = { id, ...data };
  authors[index] = updated;
  return updated;
};

const remove = (id: number) => {
  authors = authors.filter((author) => author.id !== id);
};

export = { getAll, getById, create, update, remove };
