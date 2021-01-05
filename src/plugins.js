const path = require("path");
const fs = require("fs");
const {ahk_path, js_path, plugins_path} = require("./utils/paths")
const load_json = require('./utils/json');

class Plugin {
    static list = {};
    static load_plugins(folder_path = plugins_path){
        fs.readdirSync(folder_path, {withFileTypes: true}).forEach((entry)=>{
            if(entry.isDirectory()){
                const entry_path = path.resolve(folder_path, entry.name);
                Plugin.list[entry.name] = new Plugin(entry_path);
            }
        });
    }
    constructor(dir_path){
        this.dir_path = dir_path;
        this.ahk_script = path.resolve(dir_path, "main.ahk");
        this.asset_root_path = path.resolve(this.dir_path, "assets");
        
        this.asset_list = [];
        this.load_asset_list(this.asset_root_path);
    }
    
    ahk_path(){
        return path.relative(plugins_path, this.ahk_script);
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
module.exports = Plugin;