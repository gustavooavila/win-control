class messaging {
    constructor(stdin, stdout){
        this.stdin = stdin;
        this.stdout = stdout;
        this.attach();
    }
    
    listeners = {}
    
    on(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
        return this;
    }
    
    emit(eventName, ...args) {
        let fns = this.listeners[eventName];
        if (!fns) return false;
        fns.forEach((f) => {
            f(...args);
        });
        return true;
    }
    
    attach(){
        this.stdout.on('data', async (data)=>{
            const message = data.toString();
            try{
                const json = JSON.parse(message);
                this.emit("data", json);
            }catch(err){
                this.emit("message", message)
            }
        })
    }
    sendMessage(message){
        this.stdin.write(message + '\r\n')
    }
    sendData(data){
        this.stdin.write(JSON.stringify(data) + '\r\n')
    }
}


module.exports = messaging;