const express = require("express");
const { Signup, Login, UpdateUserProfile, RemoveUserProfile, Logout, GoPremium } = require("../Controller/userController");
const { CreateArticle, GetallArticles, GetArticleByid, Comments, example } = require("../Controller/articleController");
const { Authentication} = require("../Middleware/auth");
const router = express.Router();

router.post("/signup", Signup); //signup Route
router.post("/login", Login); //login Route
router.post("/editUser", Authentication,UpdateUserProfile); //update userprofile Route
router.post("/goPremium",GoPremium); //GoPremium Member Route
router.get("/logout", Logout); //logout Route
router.delete("/deleteUser",RemoveUserProfile);  //Remove User Profile


router.post("/article", CreateArticle); // Create Article Route
router.get("/getallarticles", GetallArticles); // Getting all Article Route
router.get("/getArticle/:id",GetArticleByid)  //Getarticle by ArticleId Route

router.post("/comment",Comments);  // Comment Route

module.exports = router;
