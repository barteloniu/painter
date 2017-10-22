const ctx = document.querySelector("#canvas").getContext("2d")
const socket = io()
let color = "#0000ff"
ctx.lineWidth = 5
ctx.fillStyle = "#fff"

let dots = []

function draw(data){
    ctx.fillRect(0, 0, 1280, 720)
    if(data.touch) dots[dots.length - 1].push({x: data.x, y: data.y, color: color})
    dots.forEach(d => {
        for(let i = 1; i < d.length; i++){
            ctx.strokeStyle = d[i].color
            ctx.beginPath()
            ctx.moveTo(d[i - 1].x, d[i - 1].y)
            ctx.lineTo(d[i].x, d[i].y)
            ctx.stroke()
        }
    })
    ctx.strokeStyle = "#000"
    ctx.beginPath()
    ctx.arc(data.x, data.y, 10, 0, 2 * Math.PI)
    ctx.stroke()
}

let img = new Image()
img.src = "left.png"
img.onload = () => {
    ctx.drawImage(img, 0, 0)
}
socket.emit("cal", 0)
socket.on("called", data => {
    switch(data){
        case 0:
            img = new Image()
            img.src = "right.png"
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
            socket.emit("cal", 1)
            break
        case 1:
            img = new Image()
            img.src = "top.png"
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
            socket.emit("cal", 2)
            break
        case 2:
            img = new Image()
            img.src = "bottom.png"
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
            socket.emit("cal", 3)
            break
        case 3:
            socket.emit("cal", 4)
            ctx.fillRect(0, 0, 1280, 720)
            console.log("koniec")
            socket.on("pos", draw)
            socket.on("clearCan", () => {
                ctx.fillRect(0, 0, 1280, 720)
                dots = []
            })
            socket.on("saveCan", () => {
                document.querySelector("#imgDL").href = ctx.canvas.toDataURL("image/png")
                document.querySelector("#imgDL").click()
            })
            socket.on("color", data => {
                color = "hsl(" + data + ", 100%, 50%)"
            })
            socket.on("newTouch", () => {
                dots.push([])
            })
            socket.on("undo", () => {
                dots.pop()
            })
            break
    }
})