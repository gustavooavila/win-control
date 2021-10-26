const http = require('./http_server');
const WebSocket = require('ws');

const fs = require('fs');
const path = require("path");
const ahk_process = require("./autohotkey");
const create_main_ahk = require("./autohotkey/ahk_script");

const {plugins_path, js_path} = require("./utils/paths");
const Plugin = require("./plugins");

const http_server = new http();
const ws_server = new WebSocket.Server({ server: http_server, perMessageDeflate: false }, );

Plugin.load_plugins();
const ahk = new ahk_process(create_main_ahk(Plugin.list));
let AutohotkeyWebsocketClient;

ws_server.on('connection', function (socket, request) {
    //console.log(request.headers)
    const protocol = socket.protocol;
    const isAHK = protocol == "AHK";
    
    if(isAHK) {
        if(!ahk.connected) {
            AutohotkeyWebsocketClient = socket;
            AutohotkeyWebsocketClient.on("message", (data) => {
                ws_broadcast(data)
            });
        }
        } else {
        socket.on("message", (data) => {
            AutohotkeyWebsocketClient.send(data);
        });
    }
});


http_server.listen(90);

function ws_broadcast(data) {
    ws_server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) client.send(data);
    });
}