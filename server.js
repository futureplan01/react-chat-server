const express = require('express');
const app = express();
let port = process.env.PORT || 7555;

const server = app.listen(port,()=>{
    console.log("Server running on http://localhost:" + port);
})

const io = require("socket.io").listen(server);

io.on("connection", (client)=>{
    console.log("a user is connected");
    client.on("disconnect", ()=>{
        console.log("user has disconnected");
    })
})

client.on("server", msg =>{
    client.broadcast.emit("user", msg);
    console.log(msg);
})
