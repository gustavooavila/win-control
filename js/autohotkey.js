const path = require("path")
const { spawn } = require("child_process");
const messaging = require("./messaging");

const autohotkey_path = path.join(__dirname, "../AutoHotkey.exe");
const ahk_folder = path.join(process.cwd(), "ahk");
const stdio = ['pipe', 'pipe', process.stdout]
const spawn_options = {windowsHide: true, cwd: ahk_folder, stdio };

class autohotkey{
    constructor(script, ...args){
        args = [...args, script]
        this.process = spawn(autohotkey_path, args, spawn_options)
        this.messaging = new messaging(this.process.stdin, this.process.stdout);
        
        this.alive = true;
        this.process.on("exit", ()=>{this.alive = false;})
    }
    
    on(...params){return this.messaging.on(...params)}
    sendData(...params){return this.messaging.sendData(...params)}
    sendMessage(...params){return this.messaging.sendMessage(...params)}
}

module.exports = autohotkey;