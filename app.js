const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {})
app.use(express.static("client"))

app.get("/controller", (req, res) => {
    res.sendFile(__dirname + "/client/controller.html")
})
app.get("/display", (req, res) => {
    res.sendFile(__dirname + "/client/display.html")
})

let sockets = []

function send2All(title, data){
    sockets.forEach(s => {
        s.emit(title, data)
    })
}

io.on("connection", socket => {
    sockets.push(socket)
    console.log("połączenie")
    console.log(sockets.length)
    socket.on("cal", data => {
        send2All("cal", data)
    })
    socket.on("called", data => {
        send2All("called", data)
    })
    socket.on("pos", data => {
        send2All("pos", data)
    })
    socket.on("color", data => {
        send2All("color", data)
    })
    socket.on("clearCan", () => {
        send2All("clearCan")
    })
    socket.on("saveCan", () => {
        send2All("saveCan")
    })
    socket.on("newTouch", () => {
        send2All("newTouch")
    })
    socket.on("undo", () => {
        send2All("undo")
    })
    socket.on("disconnect", () => {
        sockets.splice(sockets.indexOf(socket), 1)
        console.log("rozlaczenie")
        console.log(sockets.length)
    })
})
let port = process.env.PORT || 3000
server.listen(port)
console.log("Server started on port", port)