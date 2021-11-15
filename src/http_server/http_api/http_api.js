class http_api {
    static endpoints = {}
    
    static register_endpoint(endpoint, method, api) {
        const api_endpoint = "/api/" + endpoint;
        if(!(api_endpoint in http_api.endpoints)){
            http_api.endpoints[api_endpoint] = {}
        }
        http_api.endpoints[api_endpoint][method] = api;
    }
    
    static register_server(http_server){
        http_server.prependListener("request", function(req, res) {
            const url = decodeURI(req.url);
            if(url in http_api.endpoints){
                http_api.endpoints[url][req.method](req, res);
            }
        });
    }
}

module.exports = http_api;