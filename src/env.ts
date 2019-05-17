import * as fs from 'fs'
import * as mkdirp from 'mkdirp'

interface Config {
    PORT: number,
    DATA_ROOT: string
}

const config: Config = {
    PORT: 8080,
    DATA_ROOT:  process.cwd() + "/data_root"
}

if (!fs.existsSync(config.DATA_ROOT))
    mkdirp.sync(config.DATA_ROOT)

export default config
