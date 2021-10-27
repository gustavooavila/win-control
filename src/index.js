const http = require('./http_server');
const ws = require('./ws_server');

const ahk_process = require("./autohotkey");
const create_main_ahk = require("./autohotkey/ahk_script");

const Plugin = require("./plugins");

const http_server = new http();
const ws_server = new ws(http_server);

Plugin.load_plugins();

const ahk = new ahk_process(create_main_ahk(Plugin.list));

http_server.listen(90);
