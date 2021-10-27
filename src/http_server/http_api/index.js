const http_api = require("./http_api")
const get_plugins = require("./get_plugins");

function register_plugins_api_endpoint(plugin_list) {
    http_api.register_endpoint("plugins", "GET", get_plugins(plugin_list));
}

module.exports = {
    http_api,
    register_plugins_api_endpoint,
}