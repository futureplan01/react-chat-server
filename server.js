const express = require('express');
const cors = require('cors');
const db = require('./model/connectDB');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const fileUpload = require('express-fileupload');
const app = express();
let port = process.env.PORT || 7555;

app.use(cors());
db.connect();
app.use(express.static('public'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/',routes);


const server = require('http').createServer(app);

const io = require("socket.io").listen(server);

io.on("connection", (client)=>{
    console.log("a user is connected");
    client.on("server", msg =>{
        client.broadcast.emit("user", msg);
        console.log(msg);
    });
    client.on("disconnect", ()=>{
        console.log("user has disconnected");
    });

})
server.listen(port,()=>{
    console.log("Server running on http://localhost:" + port);
})



