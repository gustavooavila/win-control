const path = require("path")
const { spawn } = require("child_process");

const messaging = require("./messaging");
const {plugins_path, interpreter_path} = require("../utils/paths");

const stdio = ['pipe', 'pipe', process.stdout]
const spawn_options = {windowsHide: true, cwd: plugins_path, stdio };

class autohotkey{
    constructor(script, ...args){
        args = [...args, script]
        this.process = spawn(interpreter_path, args, spawn_options)
        this.messaging = new messaging(this.process.stdin, this.process.stdout);
    }
    
    on(...params){return this.messaging.on(...params)}
    sendData(...params){return this.messaging.sendData(...params)}
    sendMessage(...params){return this.messaging.sendMessage(...params)}
}

module.exports = autohotkey;