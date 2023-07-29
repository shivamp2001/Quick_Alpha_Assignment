const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    is_premium: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Article", ArticleSchema);
