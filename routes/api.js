const express = require("express");
const bcrypt = require("bcryptjs");
const router = express();
const jwt = require("jsonwebtoken");
const User = require('./model/User');



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

                    user.save((err, registeredUser) =>{
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
        res.json ({error: err});
    })
})

router.post("/Login",(req,res)=>{
    let email = req.body.email;
    User.findOne({
        email: email
    }).then((user)=>{
        if(!user){
            return res.status(200).json(err: "Not Valid");
        }else{
            let token = jwt.sign({subject: user._id,iat: Math.floor(Date.now() / 1000) + 30}, 'secret',);
            return res.status(200).json({msg: "Successful", token: token});
        }
    })
})



