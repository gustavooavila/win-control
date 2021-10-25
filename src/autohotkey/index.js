const path = require("path")
const { spawn } = require("child_process");

const messaging = require("./messaging");
const {plugins_path, interpreter_path} = require("../utils/paths");

const spawn_options = {/*windowsHide: true,*/ cwd: plugins_path};

class AutohotkeyError extends Error {
    constructor(message, stack){
        super(message);
        this.message = message;
        this.name = "AutohotkeyError";
        this.stack = `${this.name}: ${this.message}\n${stack}`
    }
}

class autohotkey{
    constructor(script, ...args){
        args = [...args, "/ErrorStdOut", script]
        this.process = spawn(interpreter_path, args, spawn_options)
        this.messaging = new messaging(this.process.stdin, this.process.stdout);
        this.process.stderr.on("data", (data)=>{
            data = data.toString().split(": ==> ");
            throw new AutohotkeyError(data[1] || "", data[0]);
        })
    }
    
    on(...params){return this.messaging.on(...params)}
    sendData(...params){return this.messaging.sendData(...params)}
    sendMessage(...params){return this.messaging.sendMessage(...params)}
}

module.exports = autohotkey;