const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
    },
})

module.exports = User = mongoose.model('user', User);