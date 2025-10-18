const express = require('express');
const User = require('./models/user.model');
const { generateToken } = require('./services/token.service');
const userRouter = express.Router()
const moment = require('moment');
const { checkAuthentication, checkAuthorization } = require('./middleware/check-auth');





//register
userRouter.post("/register",async(req,res) =>{
   const userBody = req.body;

   try{
    if(await User.isEmailTaken(userBody.email)){
        return res.status(400).send({
            message : "Email already taken"
        })
    }

    //create user
    const user = await User.create({
        name : userBody.name,
        email : userBody.email,
        password : userBody.password
    })

    //send response
    res.status(200).send({
        message : "User registered Successfully",
        data: {
            id: user._id,
            name:user.name,
            email: user.email,
        }
    })

   }catch(error){
    res.status(500).json({
        message: error?.message
    })
   }
})


//login
userRouter.post("/login",async(req,res)=>{
   const {email,password} = req.body
   try{

    const user = await User.findOne({email});

    if(!user || !(await user.isPasswordMatch(password))) {
       return res.status(401).send({
            message: "Incorrect email or password"
        })
    }

    //JWT token generate
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        "minute"
    )
    const accessToken = await generateToken(
        user._id ,
         user.role,
         accessTokenExpires,
         "access"
        )




    res.send({
        message: "Login successfull",
        data : {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
                expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60,
            }
        },

    })

   }catch(err){
    console.log("Error",err)
   }
})


///proFile route - authentication protection
userRouter.get("/profile", checkAuthentication, async(req,res) => {
   res.send({message:"private profile endpoint"})
})


//admin route
userRouter.get("/admin" , checkAuthentication,checkAuthorization,(req,res) => {
    res.send({message:"Private admin only endpoint"})
})

module.exports = userRouter