const http = require('http');
const path = require("path");
const fs = require("fs");
const normalize = require('normalize-path');

const {plugins_path} = require("./utils/paths");

class Server extends http.Server{
    constructor(...args){
        super(...args);
        
        this.on("request", (req, res)=>{
            this.serveFile(res, normalize(req.url));
        });
    };
    serveFile(res, file_path){
        try{
            const html_content = fs.readFileSync(path.join(plugins_path,file_path));
            res.statusCode = 200;
            res.end( html_content );
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
    error404(res){
        res.statusCode=404;
        res.end();
    }
}

module.exports = Server;