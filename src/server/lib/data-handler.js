const fs = require('fs')
const mkdirp = require('mkdirp')
const env = require('../../env')

class DataHandler {
    constructor(uuid) {
        this.uuid = uuid
        if (!fs.existsSync(this.userdir))
            mkdirp.sync(this.userdir)
    }

    append(name, value) {
        const filePath = this.getFilePath(name)
        const row = `${Date.now()},${value}\n`
        if (fs.existsSync(filePath)) {
            fs.appendFileSync(filePath, row)
        } else {
            fs.appendFileSync(filePath, `${Date.now()},${name}\n`)
            fs.appendFileSync(filePath, row, {flag: "a"})
        }
    }

    list() {
        return fs.readdirSync(this.userdir)
    }

    getRawFile(name) {
        const filePath = this.getFilePath(name)
        return fs.readFileSync(filePath)
    }

    getFilePath(name) {
        return this.userdir + "/" + name
    }

    get userdir() {
        return DataHandler.ROOT + "/" + this.uuid
    }

    static get ROOT() {
        return env.DATA_ROOT
    }
}

module.exports = DataHandler
