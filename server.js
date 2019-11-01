const express = require('express');
const cors = require('cors');
const db = require('./model/connectDB');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const app = express();
let port = process.env.PORT || 7555;

db.connect();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',routes);


const server = app.listen(port,()=>{
    console.log("Server running on http://localhost:" + port);
})




