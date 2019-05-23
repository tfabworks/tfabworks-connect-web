"use strict";
exports.__esModule = true;
var fs = require("fs");
var mkdirp = require("mkdirp");
var config = {
    PORT: 8080,
    DATA_ROOT: process.cwd() + "/data_root"
};
if (!fs.existsSync(config.DATA_ROOT))
    mkdirp.sync(config.DATA_ROOT);
exports["default"] = config;
