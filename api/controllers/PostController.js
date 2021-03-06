const PostModel = require("../models/PostModel");
const CommentModel = require("../models/CommentModel");

const { body, query, param } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const authenticationOptional = require("../middleware/authenticationOptional");
const isAuthor = require("../middleware/isAuthor");

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
  async (req, res) => {
    try {
      let post = PostModel({
        title: req.body.title,
        url: req.body.url,
        author: req.user._id,
        username: req.user.username,
      });

      const savedPost = await post.save();

      let postData = savedPost.toApiRepresentation(req.user._id);
      return apiResponse.successResponseWithData(
        res,
        "Post successfully created",
        postData
      );

      /*post.save().then(post => {
        let postData = post.toApiRepresentation(req.user._id);
        return apiResponse.successResponseWithData(
          res,
          "Post successfully created",
          postData
        );
      }).catch(err => apiResponse.ErrorResponse(res, err));*/
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Get all posts.
 * 
 * @returns {Object}
 */
exports.getAll = [
  authenticationOptional,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      PostModel.find()
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => apiResponse.notFoundResponse(res, err))
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

/**
 * Get one post.
 * 
 * @returns {Object}
 */

exports.getOne = [
  authenticationOptional,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      PostModel.findById(req.params.post_id)
        .then(post => res.json(post))
        .catch(err => apiResponse.notFoundResponse(res, err))
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];


/**
 * Delete own posts.
 * 
 * @returns {Object}
 */
exports.delete = [
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  isAuthor,
  (req, res) => {
    Promise.resolve()
      .then(() => PostModel.findByIdAndDelete(req.params.post_id))
      .then(() => res.json('Post deleted.'))
      .catch(err => apiResponse.ErrorResponse(res, err))
  }
];

/**
 * Update own Post.
 *  @param {string}      title
 *  @param {string}      url
 * 
 *  @return {Post}
 */
exports.update = [
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
  isAuthor,
  (req, res) => {
    try {
      PostModel.findByIdAndUpdate(req.params.post_id)
        .then(post => {
          post.title = req.body.title;
          post.url = req.body.url;
          post.author = req.user._id;
          post.username = req.user.username;

          post.save()
            .then(() => res.json('Post updated.'))
            .catch(err => res.status(400).json('Error: ' + err))
        })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Add an upvote to a post.
 * 
 * @returns {Object}
 */
exports.upvote = [
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      PostModel.findByIdAndUpdate(req.params.post_id)
        .then(post => {
          if (!post.upvoters.includes(req.user._id))
            post.upvoters.push(req.user._id);

          post.save()
            .then(() => res.json('Vote added.'))
            .catch(err => apiResponse.ErrorResponse(res, err))
        })
    } catch (err) {
      return apiResponse.notFoundResponse(res, err);
    }
  }
]

/**
 * Delete Vote from a post.
 * 
 * @returns {Object}
 */
exports.unvote = [
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      PostModel.findByIdAndUpdate(req.params.post_id)
        .then(post => {
          post.upvoters = post.upvoters.filter(uv => uv !== req.user._id);

          post.save()
            .then(() => res.json('Vote deleted.'))
            .catch(err => apiResponse.ErrorResponse(res, err))
        })
    } catch (err) {
      return apiResponse.notFoundResponse(res, err);
    }
  }
]

/**
 * Create a comment to a post.
 * 
 * @returns {Comment}
 */
exports.createComment = [
  authenticationRequired,
  body("content", "Content is required.")
    .isLength({ min: 1 })
    .withMessage("The content cannot be empty.")
    .trim(),
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      //Create comment
      let commentID = '';
      PostModel.findByIdAndUpdate(req.params.post_id)
        .then(post => {
          let comment = CommentModel({
            post: req.params.post_id,
            content: req.body.content,
            author: req.user._id,
            username: req.user.username,
          })
          commentID = comment._id

          comment.save((err, savedComment) => {
            post.comments.push(commentID)
            post.save()

            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            let commentData = comment.toApiRepresentation(req.user._id);
            return apiResponse.successResponseWithData(
              res,
              "Comment successfully created",
              commentData
            );
          })
        }).catch((err) => {
          return apiResponse.ErrorResponse(res, err);
        })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
]

/**
 * Get all comments for a specific post.
 * 
 * @returns {Object}
 */
exports.getComments = [
  authenticationOptional,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      CommentModel.find({ "post": req.params.post_id })
        .sort({ createdAt: -1 })
        .then(comments => res.json(comments))
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];