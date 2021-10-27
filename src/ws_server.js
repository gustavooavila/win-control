const WebSocket = require('ws');

class Server extends WebSocket.Server{
    constructor (http_server) {
        super({ server: http_server, perMessageDeflate: false });
        this.on('connection', function (socket, request) {
            //console.log(request.headers);
            const protocol = socket.protocol;
            const isAHK = protocol == "AHK";
            
            if(isAHK) {
                this.registerAhkWsClient(socket);
                return
            }
            
            socket.on("message", (data) => {
                this.AutohotkeyWebsocketClient.send(data);
            });
        });
    }
    
    registerAhkWsClient(socket){
        if(this.AutohotkeyWebsocketClient) return; // should be called only once anyways...
        this.AutohotkeyWebsocketClient = socket;
        this.AutohotkeyWebsocketClient.on("message", (data) => {
            this.broadcast(data);
        });
    }
    
    broadcast(data) {
        this.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) client.send(data);
        });
    }
}

module.exports = Server;