const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
/*const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, '../public/images/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname); 
    }
})
const upload = multer ({
    storage: storage,
    limits:{fileSize:2000000}  
});*/
const jwt = require("jsonwebtoken");
const User = require('../model/User');

router.post("/Register", (req,res)=>{
    User.findOne({
        email: req.body.email
    }).then((user)=>{
        // then a user with this email address already exist 
        if(user){
            return res.status(400).json({err: "Email Already Exist"});
        }else{
            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(req.body.password, salt, (err,hash)=>{
                    if(err) throw err;
                    let newUser = new User({
                        username: req.body.name,
                        email:    req.body.email,
                        password: hash
                    })

                    newUser.save((err, registeredUser) =>{
                        if(err) res.status(400).json({err: err});
                        else{
                            // webToken last for 30 seconds
                            let token = jwt.sign({subject: registeredUser._id,iat: Math.floor(Date.now() / 1000) + 30}, 'secret',);
                            return res.status(200).json({msg: "Successful", token: token});
                        }   
                    })
                })
            })
        }
    })
    .catch ((err) =>{
        console.log(err);
        res.json ({err: err});
    })
})


//Updates Photos
router.post('/uploadImage', (req,res)=>{
    let file = req.files;
    console.log(file);
    if(file){
       let myImage = req.files.myImage;
       console.log("My Image", myImage);
       myImage.mv((__dirname +`/../public/images/${myImage.name}`),(err)=>{
           console.log("inside mv");
           if(!err){
               console.log("we good");
               return res.status(200).json({msg: "Successful"});
           }
           else{
               return res.status(404).json({msg: "Upload was not a file"});
           }
       }) 
    }else{
        console.log("File not found");
        return res.status(404).json({msg: "Upload was not a file"});
    }
})
router.post("/Login",(req,res)=>{
    User.findOne({
        email: req.body.email
    })
    .then((user)=>{
        console.log(req.body);
        if(!user){
            return res.status(401).json({err: "Authentication Not Valid"});
        }else{
            let password = req.body.password;
            let userPassword = user.password;
            console.log(password,userPassword);
            bcrypt.compare(req.body.password,user.password)
            .then(isMatch =>{
                if(isMatch){
                    // 1*60 is a minute
                    let token = jwt.sign({id: user._id, email: user.email}, 'secret',{expiresIn: 1*60});
                    return res.status(200).json({msg: "Successful", token: token});     
                }else{
                    return res.status(401).json({err: "Authentication Not Valid"});
                }
            })
            .catch((err)=>{
                console.log(err);
                return res.status(500).json({err:err});
            })
        }
    })
    .catch(err =>{
        console.log(err);
    })
})

module.exports = router;



