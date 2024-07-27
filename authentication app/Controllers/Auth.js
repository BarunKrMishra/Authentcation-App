const express = require("express");
const  bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken");
require ("dotenv").config();

const User = require ("../models/User");

//signup route handler
exports.signup = async (req,res) => {

    try{
        //get data
        const {name, email,password, role} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});
         //if existing user
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'user already exists',
            });
        }

        //password securing
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'error in hashing password'
            });
        }

        //create entry for user in db
        const user = await User.create({
            name, email, password:hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message:"user registred successfully",
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'user not created try again latter',
        });

    }
}




//login
exports.login = async(req,res) =>{
    try{

        //data fetch
        const{email, password} = req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please fill all the details'
 
            });
        }

        //check user is present or not
        let user = await User.findOne({email});
        //if not a registered
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'login kro jaake',
            });
        }

        const payload = {
            email: user.email,
            id: user.id,
            role:user.role,
        }
        //verify password  and generate jwt tokens
        if(await bcrypt.compare(password, user.password)){
            //password matches
            let token = jwt.sign(payload, 
                                 process.env.JWT_SECRET,{
                                    expiresIn:"2h",
                                 });

            user = user.toObject();
            user.token = token;
            user.password=undefined;

            console.log(user);
            
            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ),
                httpOnly:true,
            }


            res.cookie("varun_cookie", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"user logged in successfully"
            });
        }
        
        else{
            //password dont matches 
            return res.status(403).json({
                success:false,
                message:'password dont matches',
            });
        }
    }
    catch(error){

        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'login failure hogya ji'
        });

    }
}