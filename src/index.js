const http = require('./http_server');
const ws = require('./ws_server');

const { register_plugins_api_endpoint } = require("./http_server/http_api");

const ahk_process = require("./autohotkey");
const create_main_ahk = require("./autohotkey/ahk_script");

const Plugin = require("./plugins");

const http_server = new http();
const ws_server = new ws(http_server);

Plugin.load_plugins();

register_plugins_api_endpoint(Plugin.list);

const ahk = new ahk_process(create_main_ahk(Plugin.list));

http_server.listen(90);
