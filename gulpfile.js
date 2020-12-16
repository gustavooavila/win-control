const { exec } = require('pkg')

await exec([ 'src/js/index.js', '--assets', '', '--target', 'host', '--output', 'winControl.exe' ])