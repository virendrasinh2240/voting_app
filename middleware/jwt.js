const jwt = require("jsonwebtoken")

const jwtAuthMiddleware = (req,res,next)=>{

    const authorization = req.headers.authorization
    // console.log(authorization);
    
    if(!authorization) return res.status(401).json({error:"token not found"})

        const token = authorization.split(" ")[1];
        if(!token) return res.status(401).json({error:"Unauthorized"})

            try{

                const decoded = jwt.verify(token,process.env.JWT_SECRET)
                req.user = decoded
                next()

            }catch(err){
                console.error(err)
                res.status(401).json({error:"invalid token"})

            }

}

const generateToken = (callback)=>{
    return jwt.sign(callback,process.env.JWT_SECRET,{expiresIn:"5h"})
}

module.exports = {jwtAuthMiddleware,generateToken}

