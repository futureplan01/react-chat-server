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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});
const server = app.listen(port,()=>{
    console.log("Server running on http://localhost:" + port);
})


const io = require("socket.io").listen(server);

io.on("connection", (client)=>{
    console.log("a user is connected");
    client.on("disconnect", ()=>{
        console.log("user has disconnected");
    });
    client.on("server", msg =>{
        client.broadcast.emit("user", msg);
        console.log(msg);
    });
})


