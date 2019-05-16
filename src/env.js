const fs = require('fs')
const mkdirp = require('mkdirp')

const config = {
    PORT: 3000,
    DATA_ROOT:  process.cwd() + "/data_root"
}

if (!fs.existsSync(config.DATA_ROOT))
    mkdirp.sync(config.DATA_ROOT)

module.exports = config
