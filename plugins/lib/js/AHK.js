window.AHK = (function(){
    class AHK{
        constructor(){
            this.listeners = {};
            this.ws = new WebSocket(`ws://${window.location.host}`);
            
            this.ws.addEventListener("message", (data)=>{
                const {event: event_name, ...event_data} = data;
                this.emitEvent(event_name, event_data);
            });
        }
        sendEvent(event_name, event_data){
            if(this.ws.readyState !== 1) return;
            const data = {
                event: event_name,
                time: Date.now(),
                ...event_data
            };
            this.ws.send(JSON.stringify(data));
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