//const ctx = document.querySelector("#canvas").getContext("2d")
const socket = io()
let cx1, cx2, cy1, cy2
let calNum = 9999
let isCal = false
let canDraw = false
let isDrawing = false
let slider = $('#slider').slider().on("slide", () => {
    $("#s-slider .slider-handle").css("background", "hsl(" + slider.getValue() + ", 100%, 50%)")
    $("#s-slider .slider-selection").css("background", "hsl(" + slider.getValue() + ", 100%, 50%)")
    socket.emit("color", slider.getValue())
}).data("slider")
function map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}
function touchStart(){
    if(canDraw){
        isDrawing = true
        socket.emit("newTouch")
    }
}
function undo(){
    socket.emit("undo")
}
function cal(){
    isCal = true
}
function clearCan(){
    socket.emit("clearCan")
}
function saveCan(){
    socket.emit("saveCan")
}
if(window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", e => {
        /*
        if(cx1==9999){
            cx1 = e.alpha
            socket.emit("cx1", cx1)
        }
        if(cx2==9999){
            cx2 = e.alpha
            socket.emit("cx2", cx2)
        }
        if(cy1==9999){
            cy1 = e.beta
            socket.emit("cy1", cx1)
        }
        if(cy2=9999){
            cy2 = e.beta
            socket.emit("cy2", cy2)
        }
        */
        if(isCal){
            if(calNum == 0) cx1 = e.alpha
            else if(calNum == 1) cx2 = e.alpha
            else if(calNum == 2) cy1 = e.beta
            else if(calNum == 3) cy2 = e.beta
            console.log("elo" + calNum)
            console.log(cx1)
            console.log(cx2)
            console.log(cy1)
            console.log(cy2)
            isCal = false
            socket.emit("called", calNum)
        }
        document.querySelector("#h11").innerHTML = "gamma: " + Math.floor(e.gamma)
        document.querySelector("#h12").innerHTML = "beta: " + Math.floor(e.beta)
        document.querySelector("#h13").innerHTML = "alpha: " + Math.floor(e.alpha)

        socket.emit("pos", {x: map(e.alpha, cx1, cx2, 0, 1280), y: map(e.beta, cy2, cy1, 720, 0), touch: isDrawing})
        /*
        ctx.clearRect(0, 0, 500, 500)
        ctx.fillRect(map(e.alpha, cx1, cx2, 0, 500), map(e.beta, cy2, cy1, 500, 0), 10, 10)
        */
    })
}
else{
    alert("nie masz żyroskopa")
}
socket.on("cal", data => {
    calNum = data
    if(calNum == 4){
        $("#btn-cal").css("display", "none")
        $(".postCal").css("display", "inline")
        canDraw = true
    }
})