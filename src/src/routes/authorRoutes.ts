import express = require("express");
import authorController = require("../controllers/authorController");
import validate = require("../middleware/validate");

const router = express.Router();

router.post("/", validate.validateAuthor, authorController.createAuthor);
router.get("/", authorController.getAuthors);
router.get("/:id", authorController.getAuthorById);
router.put("/:id", validate.validateAuthor, authorController.updateAuthor);
router.delete("/:id", authorController.deleteAuthor);
router.get("/:id/books", authorController.getBooksByAuthor);

export = router;
