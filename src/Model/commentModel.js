const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const Comment = new mongoose.Schema(
  {
    article_reference: {type: ObjectId, ref: 'Article'} ,
    user_reference: {type: ObjectId, ref: 'User'} ,
    comment:{type:String}
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Comment", Comment);
