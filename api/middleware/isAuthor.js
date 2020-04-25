const apiResponse = require("../helpers/apiResponse");
const PostModel = require("../models/PostModel");

// this middleware will throw an error, if the user accessing a post is not the author 
const isAuthor = (req, res, next) => {
  try {
    PostModel.findById(req.params.post_id, 'author', function (err, post) {
      if (post.author === req.user._id) {
        next();
      } else {
        return apiResponse.unauthorizedResponse(res, 'You do not have the permission to do that.');
      }
    })
  } catch (err) {
    return apiResponse.notFoundResponse(res, 'No post was found that matches that ID');
  }

};

module.exports = isAuthor;


