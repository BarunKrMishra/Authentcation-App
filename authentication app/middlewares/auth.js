//auth, isstudent, isadmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) =>{
    try{


        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        // console.log("header", req.header("Authorization"));
        //extract jwt token
        //hum token ko nikalne ke 3 tarika h:-   
        //  1:- req ki body,   2:-cookies se:- req.cokkies.token,   3:-header ke anadr se:- req.header("Authorization").replace("Bearer ","");

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");  

        //agar token missing hai to
        if(!token){
            return res.status(401).json({
                success:false,
                message: "token missing"
            })
        }

        //now ab hum verify krenge token ko

        try{
            //ye hume ek decoded object dega jo ki verify krega hmare token ko
            //verfiy 2 arg leta hai phela apna token dusra secret key for verification
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            //why this??
            req.user = decode;

        } catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }

            next()

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went worng while verfing token",
        });
    };
};



exports.isStudent = (req, res, next)  =>  {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for students"
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role is not matching",
        });
    }
}


exports.isAdmin = (req, res, next)  =>  {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Admin"
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role is not matching",
        });
    }
}