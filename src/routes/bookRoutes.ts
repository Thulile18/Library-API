import express = require("express");
import bookController = require("../controllers/bookController");
import validate = require("../middleware/validate");

const router = express.Router();

router.post("/", validate.validateBook, bookController.createBook);
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.put("/:id", validate.validateBook, bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export = router;
