const express = require("express");
const PostController = require("../controllers/PostController");

const router = express.Router();

router.get("/", PostController.getAll);
// router.get("/:post_id", PostController.getOne;

//Authentication required
router.post("/", PostController.createPost); // POST /api/posts/
router.delete("/:post_id", PostController.delete);
// router.put("/:post_id", PostController.update);

module.exports = router;
