const express = require("express");
const app = express();
const route = require("./src/routes/route");
const mongoose = require("mongoose");
app.use(express.json());

mongoose
  .connect("mongodb+srv://shivamp2001:shivamp2001@mycluster.au9iv5p.mongodb.net/Quick-Alpha")
  .then(() => console.log("DataBase Connected Successfully"))
  .catch((err) => console.log(err));
app.use("/", route);

app.listen(5000, () => console.log("server running on port 5000"));
