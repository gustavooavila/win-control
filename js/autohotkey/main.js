const fs = require("fs");
const tmp = require('tmp');
const path = require("path");
const {ahk_path} = require("../utils/paths");

tmp.setGracefulCleanup();

const messaging_path = path.relative(ahk_path, path.resolve(ahk_path, "messaging.ahk"));
const json_path = path.relative(ahk_path, path.resolve(ahk_path,"json", "json.ahk"));

const script_header = `
#Singleinstance, force
#NoTrayIcon
`;

function create_main_ahk(plugins = {}, include_paths = []){
    const includes = create_includes([...include_paths, messaging_path, json_path]);
    plugins = create_plugins(plugins);
    
    const script = script_header + "\n" + includes + "\n" + plugins;
    const { fd ,name} = tmp.fileSync();
    fs.writeSync(fd, script);
    
    return name;
}

function create_plugins(plugins){
    return Object.entries(plugins).reduce((acc, [plugin_name, plugin])=>{
        plugin_path = plugin.ahk_path();
        acc.push(ahk_include(plugin_path));
        return acc;
    },[]).join("\n");
}

function create_includes(include_paths){
    return include_paths.reduce((acc, include_path)=>{
        include_path = path.relative(ahk_path, path.resolve(ahk_path, include_path));
        acc.push(ahk_include(include_path));
        return acc;
    },[]).join("\n");
}

function ahk_include(path){return `#Include, ${path}`;}

module.exports = create_main_ahk;