const UserModel = require("../Model/userModel");
const { isValidEmail } = require("../utils/validator");
const JWT=require("jsonwebtoken")

// Signup Function for new user(Creating new user)
exports.Signup = async (req, res) => {
  try {
    // destructure all the fields for validation
    const { name, number, email, password, is_premium_user } = req.body;

    // Email Id Validation
    const EmailValidate=await UserModel.findOne({email});
    if(EmailValidate) return res.status(400).json({status:false,message:"EmailId Already registered"});
    if(isValidEmail(!email)) return res.status(400).json({status:false,message:"Please write Proper EmailId"});

    // Phone Number Validation
    const NumberValidate=await UserModel.findOne({number});
    if(NumberValidate) return res.status(400).json({status:false,message:"Phone Number Already registered"})

    // creating user on DataBase
    const User = await UserModel.create(req.body);
    return res.status(201).json({ data: User });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};

// Login Function for user
exports.Login = async (req, res) => {
  try {
    const{email,password,number}=req.body;
    if(isValidEmail(!email)) return res.status(400).json({status:false,message:"Please write Proper EmailId"});

    const User=await UserModel.findOne( { $or: [ { email }, { number } ] ,password} );//Finding User according to Credentials
    if(!User) return res.status(404).json({status:false,message:"Email or Password or Number is not correct"})

    const token=JWT.sign({UserId:User._id},"quickalpha",{expiresIn:"30m"})   //Creating token using UserId 
    return res.status(200).json({token:token,message:"login successfully"})
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
};


// Update user profile
exports.UpdateUserProfile=async(req,res)=>{
  try{
    const{name, number, email, password}=req.body;

    // Find and Updating User Details
    const UpdatedData=await UserModel.findOneAndUpdate({_id:req.UserId},{$set:{name, number, email, password}}, 
    {new:true}).select({"id":0,"__v":0})

    if(!UpdatedData) return res.status(404).json({status:false,message:"User not found"})
    return res.status(201).json({status:true,UpdatedUser:UpdatedData})

  } catch(error){
    return res.status(500).json({ Error: error.message });
  }
}


// Logout Function
exports.Logout=async(req,res)=>{
  try{
    return res.status(200).json({status:true,message:"Logout Successfully"})
  } catch(error){
    return res.status(500).json({ Error: error.message });
  }
}


// goPremium function
exports.GoPremium=async(req,res)=>{
  try{ let token =req.headers["x-api-key"]   //accessing token from Hearder

  // Varifying token with secret key
  JWT.verify(token, 'quickalpha', async(err, payload) => {
  if (err){
    return res.status(401).json({status:false,message:"Please Login First"})

  }else{
    await UserModel.findOneAndUpdate({_id:payload.UserId},{$set:{is_premium_user:true}},{new:true}) //Updating is_premium_user=true
    return res.status(201).json({status:true,message:"Know You are the Prime Member"})
  }
});

}catch(error){
  return res.status(500).json({ Error: error.message });

}
}
// Remove user profile
exports.RemoveUserProfile=async(req,res)=>{
  try{
    let token =req.headers["x-api-key"]     //accessing token from Hearder

    // Varifying token with secret key
    JWT.verify(token, 'quickalpha', async(err, payload) => {
      if (err){
        return res.status(401).json({status:false,message:"Please Login First"})

      }else{
        await UserModel.deleteOne({_id:payload.UserId});    //Removing User Profile from Database
        return res.status(200).json({status:true,message:"Your Account Deleted Successfully"})
      }
  });
  }catch(error){
    return res.status(500).json({ Error: error.message });

  }
}
