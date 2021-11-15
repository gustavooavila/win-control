const fs = require("fs");
const tmp = require('tmp');
const path = require("path");
const {plugins_path, ahk_path} = require("../utils/paths");

tmp.setGracefulCleanup();

const script_header = `
#Singleinstance, force
#NoTrayIcon
FileEncoding UTF-8

;Utilities
#Include, lib/ahk/JSON.ahk
#Include, lib/ahk/Acc.ahk
#Include, lib/ahk/Gdip_All.ahk
#Include, lib/ahk/Graphics.ahk
#Include, lib/ahk/EventEmitter.ahk
#Include, lib/ahk/WinHook.ahk

;WS stuff
#Include, lib/ahk/URI.ahk
#include, lib/ahk/Socket.ahk
#include, lib/ahk/Crypto.ahk
#include, lib/ahk/WSDataFrame.ahk
#Include, lib/ahk/Buffer.ahk
#Include, lib/ahk/HTTPClient.ahk
#Include, lib/ahk/WSClient.ahk
#Include, lib/ahk/WSSession.ahk

#Include, lib/ahk/messaging.ahk

;Plugins
`;

const script_footer = "";

function create_main_ahk(plugins = {}){
    plugins = create_plugins(plugins);
    
    const script = [script_header, plugins, script_footer].join("\n");
    const { fd, name} = tmp.fileSync();
    
    fs.writeSync(fd, script);
    return name;
}

function create_plugins(plugins){
    return Object.entries(plugins).reduce((acc, [plugin_name, plugin]) => {
        plugin_path = plugin.ahk_path();
        const absolute_plugin_path = path.resolve(plugins_path, plugin_path);
        try{
            if(fs.statSync(absolute_plugin_path).isFile()) acc.push(ahk_include(plugin_path));
        }
        catch(err){}
        return acc;
    }, []).join("\n");
}


function ahk_include(path){return `#Include, ${path}`;}

module.exports = create_main_ahk;