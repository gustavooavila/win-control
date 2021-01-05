const { exec } = require('pkg')

await exec([ 'src/index.js', '--assets', '', '--target', 'host', '--output', 'winControl.exe' ])