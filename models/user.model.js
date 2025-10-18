const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true, //validation
        trim: true, //sanitization
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password: {
        type : String,
        required : true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user',"admin"],
        default : "user",
    },
   
},{
    timestamps : true,
})


//check if EMAIL IS TAKEN(2 type - model level helper)
userSchema.statics.isEmailTaken = async function (email){
    const user = await this.findOne({email});

    return !!user;

}

//check if password  match or not(instance level helper)
userSchema.methods.isPasswordMatch = async function (password){
    const user =  this;

    return bcrypt.compare(password, user.password)

}

//hash password before saving the user(instance level helper)
// 2 type hook - pre,post
userSchema.pre("save", async function(next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 10)
    next();
  })
  
const User = mongoose.model("User",userSchema)





module.exports = User