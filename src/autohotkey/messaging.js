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
            const message = data.toString().slice(0, -1);
            this.emit("message", message);
            
        });
    }
    
    sendData(data){
        this.stdin.write(JSON.stringify(data) + '\r\n')
    }
}


module.exports = messaging;