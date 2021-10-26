class NodeJS {
    static NodeJS :=  new EventEmitter()
    static wsClient := new WSSession("127.0.0.1", 90, "/", "AHK")
    
    dispatchEvent(event, data) {
        eventData := {event: event, data: data}
        string := JSON.Dump(eventData)
        NodeJS.wsClient.sendText(string)
    }
    
    addEventListener(event, ByRef cb){
        NodeJS.NodeJS.on(event, cb)
    }
    
    relay(message) {
        data := JSON.Load(message.data.PayloadText)
        NodeJS.NodeJS.emit(data.event, data)
    }
}
NodeJS.wsClient.on("TEXT", ObjBindMethod(NodeJS, "relay"))


; since we are not instantiating console, in order to get __Call to work, we need to make console extend a class with said __Call
; this is because __Call needs to be part of the `base` of the class, wich console doesn't have if we don't instantiate or extend the class...
; TLDR: this is a hack
class ConsoleBase {
    __Call(methodName, args*){
        this.Call(methodName, args*)
    }
}

class console extends ConsoleBase {
    stdin    := FileOpen("*", "r `n")
    stdout   := FileOpen("*", "w `n")
    
    Call(args*) {
        string := JSON.Dump(args)
        FileAppend, %string%`n,*
    }
}