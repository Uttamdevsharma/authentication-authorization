const jwt  = require('jsonwebtoken')
function checkAuthentication (req,res,next){
 const authHeader = req.headers.authorization

 if(!authHeader || !authHeader.startsWith("Baarer ")){
    return res.status(401).send({
        message: "Unauthorized"
    });
 }
 
 
const token = authHeader.split(" ")[1]

try{
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = decoded;
   next()

}catch(error){
    return res.status(401).send({
        message:
        process.env.NODE_ENV === "development"
        ? error.message
        : "Unauthorized",
    })
}
 
}


module.exports = checkAuthentication