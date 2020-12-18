const fs = require("fs");
const tmp = require('tmp');
const path = require("path");
const {ahk_path} = require("../utils/paths");

tmp.setGracefulCleanup();

const script_header = `
#Singleinstance, force
#NoTrayIcon
FileEncoding UTF-8

${ahk_include("includes.ahk")}
`;
const script_footer = `
NodeJS.handle()
`;
function create_main_ahk(plugins = {}){
    plugins = create_plugins(plugins);
    
    const script = [script_header,plugins,script_footer].join("\n");
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


function ahk_include(path){return `#Include, ${path}`;}

module.exports = create_main_ahk;