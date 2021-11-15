const path = require("path");
const root_path = require("../../root_path");
const cwd = process.cwd()
module.exports = {
    root_path,
    project_path: cwd,
    interpreter_path: path.resolve(cwd, "AutoHotkey.exe"),
    js_path: path.resolve(root_path, "js"),
    plugins_path: path.resolve(root_path, "plugins"),
    main_page_path: path.resolve(root_path, "mainpage")
}