const path = require("path");
const fs = require("fs");
const {ahk_path, js_path} = require("./utils/paths")
const load_json = require('./utils/json');
const plugin_list = {};
class plugins{   
    constructor(dir_path){
        this.scan_dir(dir_path);
    }
    
    scan_dir(dir_path){
        fs.readdirSync(dir_path, {withFileTypes: true}).forEach((entry)=>{
            if(entry.isDirectory()){
                const entry_path = path.resolve(dir_path, entry.name);
                this.load_plugin(entry_path);
            }
        });
    }
    
    load_plugin(dir_path){
        const json_path = path.resolve(dir_path, "package.json");
        const json = load_json(json_path);
        if(this.validate_plugin(json)){
            plugin_list[json.name] = new Plugin(dir_path, json);
        }
    }
    
    validate_plugin(json){
        if(!json.name || !json.events || !json.events.length) return false
        if(json.name in plugin_list) return false;
        return true;
    }    
    list(){return plugin_list}
    get_plugin(plugin_name){if(plugin_name in plugin_list)return plugin_list[plugin_name];}
}            
class Plugin {
    constructor(dir_path, json){
        this.dir_path = dir_path;
        this.ahk_script = path.resolve(dir_path, "main.ahk");
        this.name = json.name;
        this.assets = json.assets;
    }
    
    ahk_path(){
        return path.relative(ahk_path, this.ahk_script);
    }
    js_path(){
        return path.relative(js_path, this.dir_path);
    }
}
module.exports = plugins;