const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    number: { type: String ,unique:true},
    email: { type: String,unique:true },
    password: { type: String },
    is_premium_user: { type: Boolean,default:false },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", UserSchema);
