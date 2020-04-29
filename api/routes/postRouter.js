const express = require("express");
const PostController = require("../controllers/PostController");

const router = express.Router();

router.get("/", PostController.getAll);
router.get("/:post_id", PostController.getOne);

//Authentication required
router.post("/", PostController.createPost); // POST /api/posts/
router.delete("/:post_id", PostController.delete);
router.put("/:post_id", PostController.update);
router.put("/:post_id/upvote/:upvoter_id", PostController.upvote);
router.put("/:post_id/unvote/:upvoter_id", PostController.unvote);
router.post("/:post_id/comment", PostController.createComment);
router.get("/:post_id/comment", PostController.getComments);
// router.delete("/:post_id/comment", PostController.deleteComment);
// router.put("/:post_id/comment", PostController.editComment);


module.exports = router;
