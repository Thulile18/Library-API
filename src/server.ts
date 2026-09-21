import express = require("express");
import logger = require("./middleware/logger");
import errorMiddleware = require("./middleware/errorHandler");
import authorRoutes = require("./routes/authorRoutes");
import bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Request -> express.json() -> logger -> route -> response
app.use(express.json());
app.use(logger);

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

// These two must come last
app.use(errorMiddleware.notFoundHandler);
app.use(errorMiddleware.errorHandler);

app.listen(PORT, () => {
  console.log(`Library API running on http://localhost:${PORT}`);
});
