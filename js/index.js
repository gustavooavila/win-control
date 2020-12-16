const http = require('http');
const WebSocket = require('ws');

const path = require("path");
const autohotkey = require("./autohotkey");

const http_server = http.createServer();
const ws_server = new WebSocket.Server({ server: http_server });

const ahk_script = path.join(__dirname, "../ahk/main.ahk");
const ahk = new autohotkey(ahk_script);

ahk.on("message", function(data){ws_broadcast(data)});

ws_server.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        ahk.sendData(data);
    });
});                    


http_server.listen(8080);


function ws_broadcast(data){
    ws_server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
