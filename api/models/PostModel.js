const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: String, required: true },
    username: { type: String, required: true },
    upvoters: { type: [String], required: true }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostSchema.method("toApiRepresentation", function (user) {
  let obj = this.toObject();
  obj.author = user._id;
  obj.username = user.username;
  return obj;
});

PostSchema.method("updateLastInteraction", function () {
  return;
});

module.exports = mongoose.model("Post", PostSchema);
