window.AHK = (function(){
    class AHK{
        constructor(){
            this.listeners = {};
            this.queue = [];
            this.ws = new WebSocket(`ws://${window.location.host}`);
            
            this.ws.addEventListener("message", ({data})=>{
                data = JSON.parse(data)
                const {event: event_name, ...event_data} = data;
                this.emitEvent(event_name, event_data);
            });
            
            this.ws.addEventListener("open", () => {
                this.queue.forEach((data)=>{this.ws.send(data)})
            }, { once: true })
        }
        sendEvent(event_name, event_data){
            const data = JSON.stringify({
                event: event_name,
                time: Date.now(),
                ...event_data
            });
            
            if(this.ws.readyState !== 1){
                this.queue.push(data);
                return;
            }
            this.ws.send(data);
        }
        
        emitEvent(event_name, event_data){
            if(this.listeners[event_name]){
                this.listeners[event_name].forEach((callback)=>{callback(event_data);})
            }
        }
        addEventListener(event_name, callback){
            if(!this.listeners[event_name]){
                this.listeners[event_name] = [];
            }
            this.listeners[event_name].push(callback);
        }
    }
    return new AHK();
})()