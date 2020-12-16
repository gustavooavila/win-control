const path = require("path");
const cwd = process.cwd()
module.exports = {
    project_path: cwd,
    interpreter_path: path.resolve(cwd, "AutoHotkey.exe"),
    ahk_path: path.resolve(cwd, "ahk"),
    js_path: path.resolve(cwd, "js"),
    plugins_path: path.resolve(cwd, "plugins")
}