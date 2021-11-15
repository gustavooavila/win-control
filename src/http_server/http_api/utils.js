function getPlugins(plugin_list) {
    return Object.keys(plugin_list).map((plugin_name) => plugin_list[plugin_name]);
}

module.exports = {
    getPlugins,
};
