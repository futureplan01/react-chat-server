const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const db = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@ds237717.mlab.com:37717/loginplayground`

module.exports = {
    connect : () =>{
        mongoose.connect(db, {
            useNewUrlParser: true
        },(err)=>{
            if(err) console.log(err);
            else{
                console.log("Connection Successful");
            }
        })
    }
}