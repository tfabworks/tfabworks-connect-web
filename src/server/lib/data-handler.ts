import * as fs  from 'fs'
import * as mkdirp  from'mkdirp'
import env from'../../env'
import * as sqlite3 from 'sqlite3'
import * as LRU from 'lru-cache'

export enum Mode {Database, Csv}

export interface Options {
    mode: Mode;
}

export class DataHandler {
    dbCache: LRU<string, sqlite3.Database>;
    options: {
        mode: Mode;
    }

    constructor(options: Options) {
        this.options = options
        this.dbCache = new LRU({
            max: 50,
            dispose: (key, n) => {
                n.close((err) => {
                    if(err) console.error(err)
                })
            },
            maxAge: 1000* 60 * 60
        })
        if (!fs.existsSync(DataHandler.ROOT))
            mkdirp.sync(DataHandler.ROOT)
    }
    
    public list(uuid: string): string[] {
        if (this.options.mode === Mode.Database) {
            const conn = this.getConn(uuid)
            conn.all("SELECT name FROM sqlite_master where type='table';", (err, rows) => {
                if (err)
                  console.warn(err)
                console.log(rows)
            })
            return []
        } else if (this.options.mode === Mode.Csv)
            return fs.readdirSync(this.getUserdir(uuid))
        else
            throw new Error()
    }

    public append(uuid: string, table: string, value: string) {
        const now = Date.now()
        if (this.options.mode === Mode.Database) {
            const conn = this.getConn(uuid)
            conn.run("INSERT INTO ? (time, ?) VALUES (?, ?);", [table, table, now, value], (err) => {
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

    public tail(uuid: string, table: string) {}

    public rm(uuid: string, table: string){}

    private getConn(uuid: string) {
        let conn: sqlite3.Database|undefined = this.dbCache.get(uuid)
        if (!conn) {
            conn = new sqlite3.Database(this.getDbFilePath(uuid))
            this.dbCache.set(uuid, conn)
        }
        console.log(conn)
        return conn
    }

    getRawFile(uuid: string, name: string) {
        const filePath = this.getFilePath(uuid, name)
        return fs.readFileSync(filePath)
    }

    getDbFilePath(uuid: string) {
        return this.getUserdir(uuid) + "/" + "userdb.sqlite3"
    }

    getFilePath(uuid: string, name: string): string {
        return this.getUserdir(uuid) + "/" + name
    }

    getUserdir(uuid: string): string {
        return DataHandler.ROOT + "/" + uuid
    }

    static get ROOT(): string {
        return env.DATA_ROOT
    }
}