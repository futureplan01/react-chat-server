const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
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
                    let token = jwt.sign({subject: user._id,iat: Math.floor(Date.now() / 1000) + 30}, 'secret',);
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



