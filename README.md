# Library API

A RESTful API for a community library, built with **TypeScript and Express**. It manages **authors** and **books** (each book belongs to an author). Data is kept in memory, so it is lost when the server restarts.

## Run it

```
npm install
npm run dev
```

The server starts on `http://localhost:3000`. To use another port, set the `PORT` environment variable.

`npm run dev` restarts the server automatically whenever you save a file. Stop it with `Ctrl+C`.

## Project structure

```
src/
  server.ts               Starts Express and connects everything
  types.ts                Author and Book interfaces
  errors.ts               HttpError (an error with a status code)
  routes/                 Connects each URL to a controller function
  controllers/            Reads the request and sends the response
  services/               Business rules
  models/                 The in-memory arrays
  middleware/
    logger.ts             Logs the method and URL of every request
    validate.ts           Checks the body of POST and PUT requests
    errorHandler.ts       404 handler and central error handler
  utils/query.ts          Helpers for sorting, pagination and reading values
```

A request travels like this:
`express.json()` -> logger -> route -> validation (POST/PUT) -> controller -> service -> model -> response

## Data

**Author:** `id` (automatic), `name` (required), `birthYear` (optional whole number)

**Book:** `id` (automatic), `title` (required), `authorId` (required, must be an existing author), `year` (required whole number)

## Endpoints

### Authors

| Method | URL | What it does | Success |
|---|---|---|---|
| POST | `/authors` | Create an author | 201 |
| GET | `/authors` | List authors | 200 |
| GET | `/authors/:id` | Get one author | 200 |
| PUT | `/authors/:id` | Update an author | 200 |
| DELETE | `/authors/:id` | Delete an author | 200 |
| GET | `/authors/:id/books` | List the books of one author | 200 |

An author who still has books cannot be deleted (409). Use `DELETE /authors/:id?cascade=true` to delete the author and their books.

### Books

| Method | URL | What it does | Success |
|---|---|---|---|
| POST | `/books` | Create a book | 201 |
| GET | `/books` | List and search books | 200 |
| GET | `/books/:id` | Get one book | 200 |
| PUT | `/books/:id` | Update a book | 200 |
| DELETE | `/books/:id` | Delete a book | 200 |

### Query parameters

| URL | Parameter | Meaning |
|---|---|---|
| `/books` and `/authors/:id/books` | `title` | Title contains this text |
| | `author` | Author name contains this text |
| | `year` | Exact year |
| | `sort` | `id`, `title` or `year` (add `-` for descending, e.g. `-year`) |
| | `page`, `limit` | Pagination (default page 1, limit 10, maximum 100) |
| `/authors` | `name` | Name contains this text |
| | `sort` | `id`, `name` or `birthYear` |
| | `page`, `limit` | Pagination |

List responses look like this:

```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "data": [{ "id": 1, "title": "Things Fall Apart", "authorId": 1, "year": 1958 }]
}
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

Search books by an author's name, newest first:

```
GET /books?author=achebe&sort=-year
```

## Errors

Every error is JSON in the same shape:

```json
{ "error": "Book not found" }
```

| Status | When |
|---|---|
| 400 | Missing or invalid fields, invalid JSON, bad id, `authorId` does not exist, bad query value |
| 404 | Author, book or route not found |
| 409 | Duplicate book (same title by the same author), or deleting an author who still has books |
| 413 | Request body too large |
| 500 | Unexpected server error |

## Middleware

- **express.json()** turns the JSON body into `req.body`.
- **Logger** prints the method and URL of every request.
- **Validation** checks the body of POST and PUT requests.
- **Error handler** turns every error into a JSON response.

## Testing with Postman


1. Start the server with `npm run dev`..
2. Create an author first (`POST /authors`), then a book (`POST /books`) using that author's id..
3. Try the search, sort and pagination examples above..
4. Try the error cases: a missing field (400), an unknown id (404) and a duplicate book (409)..
