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
                Plugin.list[entry.name] = new Plugin(entry_path, entry.name);
            }
        });
    }
    constructor(dir_path, name){
        this.name = name;
        this.dirname = name;
        this.dir_path = dir_path;
        this.ahk_script = path.resolve(dir_path, "main.ahk");
        
        this.parsePackage()
    }
    
    parsePackage() {
        const package_path = path.resolve(this.dir_path, "package.json")
        this.hasPackage = fs.existsSync(package_path)
        if(this.hasPackage) {
            try {
                this.package = JSON.parse(fs.readFileSync(package_path))
                this.name = this.package.name || this.name
                }catch(e) {
                console.log(`ERROR: malformated package.json for plugin ${this.name}\n ${e}`);
            }
        }
    }
    
    ahk_path(){
        return path.relative(plugins_path, this.ahk_script);
    }
    js_path(){
        return path.resolve(js_path, path.relative(js_path, this.dir_path));
    }
    icon_path(){
        // check if
        // * plugin hasPackage
        // * package was parsed correctly
        // * package has icon entry
        if(this.hasPackage && this.package && this.package.icon){
            const icon_path = path.resolve(this.dir_path, this.package.icon);
            if(fs.existsSync(icon_path)) return icon_path; 
        }
    }
}


module.exports = Plugin;