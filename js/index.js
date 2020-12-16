const path = require("path")
const autohotkey = require("./autohotkey")

const ahk_script = path.join(__dirname, "../ahk/main.ahk")

const ahk = new autohotkey(ahk_script);

ahk.on("message", function(data){console.log(data)})
ahk.on("data", function(data){console.log(data)})