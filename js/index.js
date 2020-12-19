const http = require('http');
const WebSocket = require('ws');

const fs = require('fs');
const path = require("path");
const autohotkey = require("./autohotkey");
const create_main_ahk = require("./autohotkey/main");

const {plugins_path, js_path} = require("./utils/paths");
const Plugin = require("./plugins");

const http_server = http.createServer();
const ws_server = new WebSocket.Server({ server: http_server });

Plugin.load_plugins();
const ahk = new autohotkey(create_main_ahk(Plugin.list));

ahk.on("message", function(data){ws_broadcast(data)});

ws_server.on('connection', function connection(ws) {
    ws.on('message', function (data) {
        ahk.sendData(data);
    });
});

const routes = {"/AHK.js": path.resolve(js_path, "AHK.js")};
Object.entries(Plugin.list).forEach(([plugin_name, plugin])=>{
    const plugin_base_path = `/${plugin_name}`; 
    routes[plugin_base_path] = path.resolve(plugin.js_path(), "index.html");
    plugin.asset_list.forEach((asset_path)=>{
        const url_path = plugin_base_path + "/" +asset_path.split("\\").join("/").replace("assets/","");
        routes[url_path] = path.resolve(plugin.js_path(), asset_path);
    });
});

http_server.on("request", function(req, res){
    function sendFile(path){
        try{
            html_content = fs.readFileSync(path);
            res.statusCode=200;
            res.end(html_content);
            }catch(err){
            res.statusCode=404;
            res.end();
        }
    }
    
    if(routes[req.url]){
        sendFile(routes[req.url]);
        }else{
        res.statusCode=403;
        res.end();
    }
})


http_server.listen(90);

function ws_broadcast(data){
    ws_server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) client.send(data);
    });
}        