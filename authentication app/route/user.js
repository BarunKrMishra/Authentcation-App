const express = require("express");
const router = express.Router();

const User = require("../models/User.js");

const {login , signup} = require("../Controllers/Auth.js");
const {auth, isStudent, isAdmin} = require("../middlewares/auth.js");

router.post("/login", login);
router.post("/signup",signup);


//for testing and learning phase
router.get("/test", auth, (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for test"
    });
});


//protected routes 

//for student
router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for students"
    });
});


//for admin
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success:true,
        message:"welcome to the protected route for students"
    });
}); 


// router.get("/getEmail", auth, async (req, res) => {

//     try{
//         const id = req.user.id;
//         console.log("id:",id);
//         const user = await User.findById(id);

//         res.status(200).json({
//             success:true,
//             user:user,
//             message:"welcome to the email route"
//         })
//     }
    
//     catch(error){

//         res.status(500).json({
//             success:false,
//             error:error.message,
//             message:"fat gya ji hmara code"
//         })
//     }
   
// });

module.exports = router;