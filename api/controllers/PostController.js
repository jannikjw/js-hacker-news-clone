const PostModel = require("../models/PostModel");

const { body, query, param } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const authenticationOptional = require("../middleware/authenticationOptional");
const injectPostFromID = require("../middleware/injectPostFromID");

const apiResponse = require("../helpers/apiResponse");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //false to use native findOneAndUpdate()

/**
 * Create a new Post.
 *
 * @param {string}      title
 * @param {string}      url
 *
 * @return {Post}
 */

exports.createPost = [
  authenticationRequired,
  body("title", "Title is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("The title needs to be between 1 and 100 characters long.")
    .trim(),
  body("url")
    .isLength({ min: 1, max: 500 })
    .withMessage("The URL needs to be between 1 and 500 characters long.")
    .isURL({
      protocols: ["https", "http"],
      require_protocol: true,
      require_valid_protocol: true,
    })
    .withMessage("Please enter a valid URL leading with https:// or http://.")
    .trim(),
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      let post = PostModel({
        title: req.body.title,
        url: req.body.url,
        author: req.user._id,
        username: req.user.username,
      });

      post.save((err, savedPost) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        let postData = post.toApiRepresentation(req.user._id);
        // savedPost.updateLastInteraction(0);
        return apiResponse.successResponseWithData(
          res,
          "Post successfully created",
          postData
        );
      });
    } catch {}
  },
];
