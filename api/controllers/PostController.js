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
        .then(posts => res.json(posts))
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
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  isAuthor,
  (req, res) => {
    try {
      PostModel.findById(req.params.post_id)
        .then(post => res.json(post))
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
// exports.delete = [
//   authenticationRequired,
//   rejectRequestsWithValidationErrors,
//   (req, res) => {
//     try {
//       PostModel.findById(req.params.post_id, 'author', function (err, post) {
//         if (post.author === req.user._id) {
//           PostModel.findByIdAndDelete(req.params.post_id)
//             .then(() => res.json('Post deleted.'))
//         } else {
//           return apiResponse.unauthorizedResponse(res, 'You do not have the right to delete this post!')
//         }
//       })
//     } catch (err) {
//       return apiResponse.ErrorResponse(res, err);
//     }
//   }
// ];

exports.delete = [
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  isAuthor,
  (req, res) => {
    PostModel.findByIdAndDelete(req.params.post_id)
      .then(() => res.json('Post deleted.'))
      .catch((err) => apiResponse.ErrorResponse(res, err))
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
        })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
]