# Library API

A RESTful API for a community library, built with **TypeScript + Express**. It manages **Authors** and **Books** (each book belongs to an author). Data is stored in memory, so it resets when the server restarts.

## Getting started

```bash
npm install
npx tsc --outDir dist --rootDir src
node dist/server.js
```

The server runs at `http://localhost:3000`.

Run the last two commands again after every code change.

## Project structure

```
src/
  server.ts               Entry point: configures Express and mounts routes
  types.ts                Author and Book interfaces
  errors.ts               HttpError class (400 / 404 / 409)
  routes/                 Maps method + URL to a controller
    authorRoutes.ts
    bookRoutes.ts
  controllers/            Handles request/response, chooses status codes
    authorController.ts
    bookController.ts
  services/               Business rules (author must exist, no duplicates)
    authorService.ts
    bookService.ts
  models/                 In-memory storage (the arrays)
    authorModel.ts
    bookModel.ts
  middleware/
    logger.ts             Logs method & URL
    validate.ts           Payload validation for POST and PUT
    errorHandler.ts       404 handler + centralized error handler
  utils/query.ts          Query-string helpers (sort, paginate, search)
```

Request flow: `express.json()` -> logger -> route -> validation (POST/PUT) -> controller -> service -> model -> response.

## Data models

**Author**: `id` (auto), `name` (required, max 100 chars), `bio` (optional), `birthYear` (optional integer)

**Book**: `id` (auto), `title` (required, max 200 chars), `authorId` (required, must exist), `year` (required integer), `isbn` (optional)

## Endpoints

### Authors

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/authors` | Create an author | 201 |
| GET | `/authors` | List authors (`name`, `sort`, `page`, `limit`) | 200 |
| GET | `/authors/:id` | Get an author by ID | 200 |
| PUT | `/authors/:id` | Update an author (full replacement) | 200 |
| DELETE | `/authors/:id` | Delete an author. Returns **409** if the author still has books; add `?cascade=true` to delete their books too | 200 |
| GET | `/authors/:id/books` | List an author's books (supports the same query params as `/books`) | 200 |

### Books

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/books` | Create a book | 201 |
| GET | `/books` | List / search books | 200 |
| GET | `/books/:id` | Get a book by ID | 200 |
| PUT | `/books/:id` | Update a book (full replacement) | 200 |
| DELETE | `/books/:id` | Delete a book | 200 |

### Query parameters (`GET /books` and `GET /authors/:id/books`)

| Param | Meaning |
|---|---|
| `title` | Partial, case-insensitive title match |
| `author` | Partial, case-insensitive author name match |
| `authorId` | Exact author ID |
| `year` | Exact publication year |
| `yearFrom`, `yearTo` | Inclusive year range |
| `search` | Matches title, author name, or ISBN |
| `sort` | `id`, `title`, `year`, `authorId`. Prefix with `-` for descending (e.g. `-year`) |
| `page`, `limit` | Pagination (default `page=1`, `limit=10`, max 100) |

`GET /authors` supports `name`, `sort` (`id`, `name`, `birthYear`), `page` and `limit`.

List responses look like this:

```json
{ "data": [], "meta": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 } }
```

## Examples

Create an author:

```
POST /authors
{ "name": "Chinua Achebe", "birthYear": 1930 }
```

Create a book:

```
POST /books
{ "title": "Things Fall Apart", "authorId": 1, "year": 1958 }
```

Search books by author name, newest first:

```
GET /books?author=achebe&sort=-year
```

## Error handling

Every error uses the same JSON shape:

```json
{ "error": { "status": 400, "message": "Validation failed", "details": ["authorId is required"] } }
```

| Status | When |
|---|---|
| 400 | Missing or invalid fields, malformed JSON, non-numeric ID, `authorId` doesn't reference an existing author, bad query parameters |
| 404 | Author or book not found, unknown route |
| 409 | Duplicate book (same title by the same author, ignoring case); deleting an author who still has books |
| 500 | Unexpected server error |

## Middleware

- **express.json()**: parses JSON request bodies into `req.body`.
- **Logger**: prints `[timestamp] METHOD /url` for every request.
- **Validation**: `validateAuthor` and `validateBook` run on both POST and PUT and strip unknown fields.
- **Error handler**: one place that turns thrown errors into JSON responses.

## Testing with Postman

1. Import `postman/Library-API.postman_collection.json`.
2. Make sure the `baseUrl` collection variable is `http://localhost:3000`.
3. Run the requests in order: create an author first, then books (the sample requests use ID 1).
