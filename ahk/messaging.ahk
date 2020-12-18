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
        string := Jxon_Dump(event_data)
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
        this.listeners[event].Push(Func(callback).Bind(this))
    }
    
    emitEvent(event, data){
        if(this.listeners[event]){
            For index, callback in this.listeners[event]
            callback.Call(data)
        }
    }
    handle(){
        Loop {
            Sleep, 10
            raw_data := this.read_stdin()
            if(raw_data){
                json_data := Jxon_Load(raw_data)
                event_data := {}
                For key, value in json_data {
                    if(key != "event"){
                        event_data[key] := value
                    }
                }
                this.emitEvent(json_data["event"], event_data)
            }
        }
    }
}

NodeJS := new NodeJSMessaging()