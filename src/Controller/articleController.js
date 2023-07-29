const ArticleModel = require("../Model/articleModel");
const UserModel = require("../Model/userModel");
const CommentModel=require("../Model/commentModel")

const JWT = require("jsonwebtoken");
// function for creating a new articles
exports.CreateArticle = async (req, res) => {
  try {
    const Article = await ArticleModel.create(req.body);
    return res.status(201).json({ data: Article });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};

// function for getting all the articles
exports.GetallArticles = async (req, res) => {
  try {
    console.log(req.body);
    let token = req.headers["x-api-key"];
    JWT.verify(token, 'quickalpha', async(err, payload) => {
  
    if (err){                                               //for public user
    const Allarticles=await ArticleModel.find({is_premium:false})
    return res.status(200).json({Articles:Allarticles});
        
  }else{
    const CheckPremiumUser=await UserModel.findOne({_id:payload.UserId});   // if user is logdin and premium member
    if(CheckPremiumUser.is_premium_user===true){          

    const Allarticles=await ArticleModel.find()
    return res.status(200).json({Articles:Allarticles});
  }else{                                               
    const Allarticles=await ArticleModel.find({is_premium:false});   //if user only logdin
    return res.status(403).json({status:true,Articles:Allarticles});
   }    
 }
    
 });

  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};


// GetArticles bye id
exports.GetArticleByid=async(req,res)=>{
  const ArticleId= req.params.id;
  let NormalArticles=""
  let token =req.headers["x-api-key"];     //accessing token from Hearder
  
  JWT.verify(token, 'quickalpha', async(err, payload) => {
    if (err){
      const Article=await ArticleModel.findOne({_id:ArticleId,is_premium:false}).select({"createdAt":0,"updatedAt":0,"__v":0});
      
      if(!Article) return res.status(404).json({status:false,message:"Article Not Found"});
      
      const Comments=await CommentModel.find({article_reference:Article._id}).populate("user_reference")
      .select({"createdAt":0,"updatedAt":0,"__v":0,"article_reference":0});
     
   const reviews = JSON.parse(JSON.stringify(Comments));

  let keys=["number","email","password","is_premium_user","createdAt","updatedAt","__v"]

   for (let i = 0; i < reviews.length; i++) {
     for(let j=0;j<keys.length;j++){

       delete reviews[i].user_reference[`${[keys[j]]}`]
     }
   }

     let obj={
         Article,
         CommentDetails:reviews
            }
            NormalArticles=obj
   return res.status(200).json({obj});

  }else{
   const CheckPremiumUser=await UserModel.findOne({_id:payload.UserId});
       if(CheckPremiumUser.is_premium_user===true){        //for premium user

   const Article=await ArticleModel.findById(ArticleId);
   const Comments=await 
   CommentModel.find({article_reference:Article._id}).populate("user_reference")
   .select({"createdAt":0,"updatedAt":0,"__v":0,"article_reference":0});

 const reviews = JSON.parse(JSON.stringify(Comments));
 let keys=["number","email","password","is_premium_user","createdAt","updatedAt","__v"]

   for (let i = 0; i < reviews.length; i++) {           //removing unwanted fields from response data
     for(let j=0;j<keys.length;j++){

       delete reviews[i].user_reference[`${[keys[j]]}`]
     }
   }

  let obj={
   Article,
   CommentDetails:reviews
  }
   return res.status(200).json({Articles:obj});
       }else{                                            //for normal user
        const Article=await ArticleModel.findOne({_id:ArticleId,is_premium:false}).select({"createdAt":0,"updatedAt":0,"__v":0});
      
        if(!Article) return res.status(404).json({status:false,message:"Article Not Found"});
        
        const Comments=await CommentModel.find({article_reference:Article._id}).populate("user_reference")
        .select({"createdAt":0,"updatedAt":0,"__v":0,"article_reference":0});
       
     const reviews = JSON.parse(JSON.stringify(Comments));
  
    let keys=["number","email","password","is_premium_user","createdAt","updatedAt","__v"]
  
     for (let i = 0; i < reviews.length; i++) {
       for(let j=0;j<keys.length;j++){
  
         delete reviews[i].user_reference[`${[keys[j]]}`]
       }
     }
  
       let obj={
           Article,
           CommentDetails:reviews
              }
              NormalArticles=obj
     return res.status(200).json({obj});
       }}
     
 });
}



// comments on articles
exports.Comments=async(req,res)=>{
  try{
    const{article_reference,comment}=req.body;
    let token =req.headers["x-api-key"]         //accessing token from Hearder
    JWT.verify(token, 'quickalpha', async(err, payload) => {
    if (err){                               
          return res.status(200).json({status:false,message:"Please Login First"});
          
        }else{
    let CheckPremiumArticle=await ArticleModel.findById({_id:article_reference});
    if(!CheckPremiumArticle) return res.status(404).json({status:false,message:"Article Not Found"});

    if(CheckPremiumArticle.is_premium===true){      
        const CheckPremiumUser=await UserModel.findById({_id:payload.UserId});

        if(CheckPremiumUser.is_premium_user===true){      //For premium member
        req.body.user_reference=payload.UserId;
        const Comment=await CommentModel.create(req.body);
        return res.status(201).json({status:true,comment:Comment});

    }else{
    return res.status(403)
    .json({status:false,message
    :"The article is premium and you are not a premium member / You are not authorised"});
    }
    }else{                                              //For Normal user
      req.body.user_reference=payload.UserId;
      const Comment=await CommentModel.create(req.body);
       return res.status(201).json({status:true,comment:Comment});
    }}
        
    });

  }catch(error){
    return res.status(500).json({ Error: error.message });
  }
}



