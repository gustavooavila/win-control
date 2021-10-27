const http = require('http');
const path = require("path");
const fs = require("fs");
const normalize = require('normalize-path');

const {plugins_path, main_page_path} = require("../utils/paths");
const { http_api } = require("./http_api");

class Server extends http.Server{
    constructor(...args){
        super(...args);
        
        this.on("request", (req, res)=>{
            this.serveFile(res, normalize(req.url));
        });
        
        http_api.register_server(this);
    };
    serveFile(res, file_path){
        file_path = decodeURI(file_path);
        if(file_path == "/") {
            const html_content = fs.readFileSync(path.join(main_page_path, "index.html"));
            res.statusCode = 200;
            res.end( html_content );
            return
        }
        try{
            const file_content = fs.readFileSync(path.join(main_page_path, file_path));
            res.statusCode = 200;
            res.end( file_content );
            }catch(err){
            try{
                const file_content = fs.readFileSync(path.join(plugins_path, file_path));
                res.statusCode = 200;
                res.end( file_content );
                }catch(err){
                try{
                    const html_content = fs.readFileSync(path.join(plugins_path, file_path, "index.html"));
                    res.statusCode = 200;
                    res.end( html_content );
                    }catch(err){
                    this.error404(res);
                }
            }
        }
    }
    error404(res){
        res.statusCode=404;
        res.end();
    }
}

module.exports = Server;