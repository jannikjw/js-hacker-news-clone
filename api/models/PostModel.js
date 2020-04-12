const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// hide some fields from the API reponse
UserSchema.method("toJSON", function () {
  return this.toObject();
});

module.exports = mongoose.model("Post", PostSchema);
