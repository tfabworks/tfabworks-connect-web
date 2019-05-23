import * as fs  from 'fs'
import * as mkdirp  from'mkdirp'
import env from'../../env'
import * as sqlite3 from 'sqlite3'

export enum Mode {Database, Csv}

export interface Options {
    mode: Mode;
}

type FilePath = string;

export class DataHandler {
    options: {
        mode: Mode;
    }

    constructor(options: Options) {
        this.options = options
        if (!fs.existsSync(DataHandler.ROOT))
            mkdirp.sync(DataHandler.ROOT)
    }

    public list(uuid: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if (this.options.mode === Mode.Database) {
                const conn = this.getConn()
                conn.all("SELECT DISTINCT category FROM master where uuid=?;", uuid, (err, rows) => {
                    if (err)
                        console.warn(err)
                    console.log(rows.map(i => i.category))
                    resolve(rows.map(i => i.category))
                })
            } else if (this.options.mode === Mode.Csv)
                resolve(fs.readdirSync(this.getUserdir(uuid)))
            else
                reject(new Error())
        })
    }

    public append(uuid: string, table: string, value: string) {
        const now = Date.now()
        if (this.options.mode === Mode.Database) {
            const conn = this.getConn()
            conn.run("INSERT INTO master (uuid, category, time, value) VALUES (?, ?, ?, ?);", [uuid, table, now, value], (err) => {
                if (err)
                    console.warn(err)
            })
        } else if (this.options.mode === Mode.Csv) {
            const filePath = this.getFilePath(uuid, table)
            const row = `${now},${value}\n`
            console.log(filePath)
            if (fs.existsSync(filePath)) {
                fs.appendFileSync(filePath, row)
            } else {
                fs.appendFileSync(filePath, `time,${name}\n`)
                fs.appendFileSync(filePath, row, {flag: "a"})
            }
        }
    }

    public tail(uuid: string, table: string) {
        return new Promise((resolve, reject) => {
            const conn = this.getConn()
            conn.all("SELECT * FROM master WHERE uuid = ? AND category = ? ORDER BY time DESC LIMIT 20;", [uuid, table], (err, rows) => {
                if (err)
                    console.error(err)
                console.log(rows)
                resolve(rows)
            })
        })
    }

    public rm(uuid: string, table: string){}

    private getConn() {
        const conn = new sqlite3.Database(this.getDbFilePath)
        conn.run(`CREATE TABLE IF NOT EXISTS master
                    ( uuid text
                    , category text
                    , time integer
                    , value text
                 );`, (err) => {
            if (err)
                console.warn(err)
        })
        return conn
    }

    getRawFile(uuid: string, name: string) {
        const filePath = this.getFilePath(uuid, name)
        return fs.readFileSync(filePath)
    }

    getFilePath(uuid: string, name: string): FilePath {
        return this.getUserdir(uuid) + "/" + name
    }

    getUserdir(uuid: string): FilePath {
        const tmpDir = DataHandler.ROOT + "/" + uuid
        if (!fs.existsSync(tmpDir))
            mkdirp.sync(tmpDir)
        return tmpDir
    }

    get getDbFilePath(): FilePath {
        return DataHandler.ROOT + "/" + "userdb.sqlite3"
    }

    static get ROOT(): FilePath {
        return env.DATA_ROOT
    }
}
