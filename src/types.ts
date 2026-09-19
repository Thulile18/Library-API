export interface Author {
  id: number;
  name: string;
  bio?: string;
  birthYear?: number;
}

export interface Book {
  id: number;
  title: string;
  authorId: number;
  year: number;
  isbn?: string;
}

