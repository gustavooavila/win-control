const http = require('http');
const WebSocket = require('ws');

const fs = require('fs');
const path = require("path");
const autohotkey = require("./autohotkey");
const create_main_ahk = require("./autohotkey/main");

const {plugins_path} = require("./utils/paths");
const plugin_loader = require("./plugins");

const http_server = http.createServer();
const ws_server = new WebSocket.Server({ server: http_server });

const plugins = new plugin_loader(plugins_path);
const ahk = new autohotkey(create_main_ahk(plugins.list()));

ahk.on("message", function(data){ws_broadcast(data)});

ws_server.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        ahk.sendData(data);
    });
});

http_server.on("request", function(req, res){
    const url = req.url.slice(1);
    const plugin = plugins.get_plugin(url);
    if(plugin){
        html_path = path.resolve(plugin.js_path(), "index.html");
        html_content = fs.readFileSync(html_path);
        res.statusCode=200;
        
        res.end(html_content);
    }
})

http_server.listen(8080);

function ws_broadcast(data){
    ws_server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) client.send(data);
    });
}       