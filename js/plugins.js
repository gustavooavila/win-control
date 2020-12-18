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
        
        plugin_list[json.name] = new Plugin(dir_path, json);
    }
    
    list(){return plugin_list}
    get_plugin(plugin_name){if(plugin_name in plugin_list)return plugin_list[plugin_name];}
}            
class Plugin {
    constructor(dir_path, json){
        this.dir_path = dir_path;
        this.ahk_script = path.resolve(dir_path, "main.ahk");
        this.name = path.dirname(dir_path);
        this.asset_root_path = path.resolve(this.dir_path, "assets");
        
        this.asset_list = [];
        this.load_asset_list(this.asset_root_path);
    }
    
    ahk_path(){
        return path.relative(ahk_path, this.ahk_script);
    }
    js_path(){
        return path.resolve(js_path, path.relative(js_path, this.dir_path));
    }
    
    
    load_asset_list(root_path){
        if(existDirectory(root_path)){
            
            fs.readdirSync(root_path,{withFileTypes: true}).forEach((entry)=>{
                const entry_path = path.resolve(root_path, entry.name);
                if(entry.isDirectory()){
                    this.load_asset_list(entry_path);
                    } else if(entry.isFile()){
                    const relative_entry_path = path.relative(this.dir_path, entry_path);
                    this.asset_list.push(relative_entry_path);
                }
            });
            
        }
    }
}

function existDirectory(directory){
    const exists = fs.existsSync(directory);
    if(exists){
        const isDirectory = fs.statSync(directory).isDirectory();
        return isDirectory;
    }
    return false; 
}
module.exports = plugins;