const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post: { type: [String], required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    username: { type: String, required: true }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

CommentSchema.method("toApiRepresentation", function (user) {
  let obj = this.toObject();
  obj.author = user._id;
  obj.username = user.username;
  return obj;
});

module.exports = mongoose.model("Comment", CommentSchema);