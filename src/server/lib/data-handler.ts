import * as fs  from 'fs'
import * as mkdirp  from'mkdirp'
import env from'../../env'
import * as sqlite3 from 'sqlite3'

enum DataFormat {Database, Csv}

interface Options {
    mode: DataFormat;
}

export default
class DataHandler {
    db: sqlite3.Database;
    options: {
        mode: DataFormat;
    }

    constructor(options: Options) {
        this.options = options

        if (!fs.existsSync(DataHandler.ROOT))
            mkdirp.sync(DataHandler.ROOT)
    }

    public list(uuid: string): string[] {
        if (this.options.mode === DataFormat.Csv)
            return fs.readdirSync(this.userdir)
        else if (this.options.mode === DataFormat.Database)
            return []
            //TODO
        else
            throw new Error()
    }

    public append(name: string, value: string) {
        const filePath = this.getFilePath(name)
        const row = `${Date.now()},${value}\n`
        console.log(filePath)
        if (fs.existsSync(filePath)) {
            fs.appendFileSync(filePath, row)
        } else {
            fs.appendFileSync(filePath, `time,${name}\n`)
            fs.appendFileSync(filePath, row, {flag: "a"})
        }
    }

    public tail(uuid: string, fname: string){}

    public rm(uuid: string, fname: string){}

    getRawFile(name: string) {
        const filePath = this.getFilePath(name)
        return fs.readFileSync(filePath)
    }

    getFilePath(name: string): string {
        return this.userdir + "/" + name
    }

    get userdir(): string {
        return DataHandler.ROOT + "/" + this.uuid
    }

    static get ROOT(): string {
        return env.DATA_ROOT
    }
}

module.exports = DataHandler
