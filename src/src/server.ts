import express = require("express");
import logger = require("./middleware/logger");
import handlers = require("./middleware/errorHandler");
import authorRoutes = require("./routes/authorRoutes");
import bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = 3000;

// Request -> express.json() -> logger -> route handler -> response
app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => {
  res.status(200).json({ name: "Library API", status: "ok" });
});
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

// Must come last: unknown routes, then the centralized error handler
app.use(handlers.notFoundHandler);
app.use(handlers.errorHandler);

app.listen(PORT, () => {
  console.log(`Library API running at http://localhost:${PORT}`);
});
