const path = require("path")
const { getPlugins } = require("./utils");
const { plugins_path } = require("../../utils/paths")

function api_get_plugins(plugin_list) {
    const plugins = getPlugins(plugin_list);
    return function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        
        const response = JSON.stringify(
            plugins.map((plugin)=>({
                icon_path : (()=>{icon_path = plugin.icon_path(); return icon_path ? path.relative(plugins_path, icon_path) : undefined})(),
                plugin_path: path.relative(plugins_path, plugin.dir_path),
                name: plugin.name
            }))
        );
        
        res.end(response);
    }
}

module.exports = api_get_plugins;