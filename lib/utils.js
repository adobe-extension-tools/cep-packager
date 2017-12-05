"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var rimraf = require("rimraf");
var mkdirplib = require("mkdirp");
var child_process_1 = require("child_process");
function copyAndReplace(from, to, replace) {
    var contents = fs_1.readFileSync(from, 'utf8');
    Object.keys(replace).forEach(function (key) {
        contents = contents.replace(new RegExp("" + key, 'g'), replace[key]);
    });
    fs_1.writeFileSync(to, contents);
}
exports.copyAndReplace = copyAndReplace;
function rmrf(path) {
    rimraf.sync(path);
}
exports.rmrf = rmrf;
function mkdirp(path) {
    mkdirplib.sync(path);
}
exports.mkdirp = mkdirp;
function cp(from, to) {
    child_process_1.execSync("cp " + from + " " + to);
}
exports.cp = cp;
function cpr(from, to) {
    child_process_1.execSync("cp -r " + from + " " + to);
}
exports.cpr = cpr;
