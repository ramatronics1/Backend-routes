const jwt = require('jsonwebtoken')

const jwtAuth=(req,res,next)=>{

const token = req.cookies.jwt;

if(token){
    jwt.verify(token,'clientLogin secret', (err,decodedToken)=>{
        if(err){
            //redirect
            console.log('redirect')
            console.log(err)
        }
        else{
            console.log(decodedToken)
            next();
        }
    })
}
else{
    // redirect code
}

}