class NodeJSMessaging{
    __new(){
        this.stdin    := FileOpen("*", "r `n")
        ;this.stdout   := FileOpen("*", "w `n")
        this.latest   := ""
        
        this.listeners := {}
        
    }
    
    dispatchEvent(event, data){
        event_data := {event: event}
        for key, value in data
        event_data[key] := value
        string := JSON.Dump(event_data)
        FileAppend, %string%`n,*
    }
    
    read_stdin(){
        data := RTrim(this.stdin.ReadLine(), "`n")
        this.stdin.Read(0)
        
        data := StrReplace(data, "\""", """")
        data := StrReplace(data, """{", "{")
        data := StrReplace(data, "}""", "}")
        
        if (this.latest != data) {
            this.latest := data
            return data 
        }
    }
    addEventListener(event, callback){
        if(!this.listeners[event]){
            this.listeners[event] := []
        }
        this.listeners[event].Push(Func(callback).bind())
    }
    
    emitEvent(data, raw_data){
        if(this.listeners[data.event]){
            For index, callback in this.listeners[data.event]
            callback.Call(data, raw_data)
        }
    }
    
    handle(){
        Loop {
            Sleep, 10
            raw_data := this.read_stdin()
            if(raw_data){
                json_data := JSON.Load(raw_data)
                this.emitEvent(json_data, raw_data)
            }
        }
    }
}

NodeJS := new NodeJSMessaging()