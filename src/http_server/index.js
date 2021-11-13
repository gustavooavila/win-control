const http = require('http');
const path = require("path");
const fs = require("fs");
const normalize = require('normalize-path');

const {plugins_path, main_page_path} = require("../utils/paths");
const { http_api } = require("./http_api");

const mainpage_index = path.join(main_page_path, "index.html");
const plugin_index = (plugin_name) => path.join(plugins_path, plugin_name, "index.html");

class Server extends http.Server {
    constructor(...args) {
        super(...args);
        
        
        this.on("request", (req, res) => {
            const file_path = decodeURI(new URL(req.url, `http://${req.headers.host}`).pathname);
            if(file_path == "/") {
                const mainpage_page = this.getFile(mainpage_index);
                mainpage_page ? this.sendFile(res, mainpage_page) : this.error404(res);
            }
            else
            {
                const asset = this.getAsset(file_path);
                if(asset)
                {
                    this.sendFile(res, asset)
                } else
                {
                    const plugin_page = this.getFile(plugin_index(file_path))
                    if(plugin_page){
                        if(req.headers["sec-fetch-dest"] == "iframe"){
                            this.sendFile(res, plugin_page);
                        }else
                        {
                            const mainpage_page = this.getFile(mainpage_index);
                            mainpage_page ? this.sendFile(res, mainpage_page) : this.error404(res);
                        }
                        }else{
                        this.error404(res)
                    }
                }
            }
        });
        
        http_api.register_server(this);
    };
    getAsset(file_path) {
        const mainpage_asset = this.getFile(path.join(main_page_path, file_path));
        return mainpage_asset ? mainpage_asset : this.getFile(path.join(plugins_path, file_path));
    }
    getFile(file_path) {
        if(!fs.existsSync(file_path)) return false;
        if(!fs.lstatSync(file_path).isFile()) return false;
        return fs.readFileSync(file_path)
    }
    sendFile(res, file_contents) {
        res.statusCode = 200;
        res.end(file_contents);
    }
    error404(res) {
        res.statusCode=404;
        res.end();
    }
}

module.exports = Server;