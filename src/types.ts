// The shape of the data we store.

export interface Author {
  id: number;
  name: string;
  birthYear?: number;
}

export interface Book {
  id: number;
  title: string;
  authorId: number;
  year: number;
}
