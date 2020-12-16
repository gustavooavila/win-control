const fs = require("fs");
module.exports = function(path){return JSON.parse(fs.readFileSync(path).toString());}