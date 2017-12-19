"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var os_1 = require("os");
var fs_1 = require("fs");
var zxp_sign_cmd_1 = require("zxp-sign-cmd");
var child_process_1 = require("child_process");
var packager_macos_1 = require("./packager.macos");
var packager_windows_1 = require("./packager.windows");
var utils_1 = require("./utils");
function createInstallers(opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts.paths = opts.paths || {};
                    opts.paths.cwd = opts.paths.cwd || path.join('/tmp', opts.bundleId);
                    opts.paths.templates = opts.paths.templates || path.join(__dirname, '..', 'templates');
                    opts.paths.macOs = opts.paths.macOs || path.join(opts.paths.cwd, 'macos');
                    opts.paths.macOsInstallerFiles = opts.paths.macOsInstallerFiles || path.join(opts.paths.macOs, 'installer-files');
                    opts.paths.macOsScripts = opts.paths.macOsScripts || path.join(opts.paths.macOs, 'scripts');
                    opts.paths.macOsTemplates = opts.paths.macOsTemplates || path.join(opts.paths.templates, 'macos');
                    opts.paths.macOsMeta = opts.paths.macOsMeta || path.join(opts.paths.macOs, 'meta');
                    opts.paths.windows = opts.paths.windows || path.join(opts.paths.cwd, 'windows');
                    opts.paths.windowsInstallerFiles = opts.paths.windowsInstallerFiles || path.join(opts.paths.windows, 'installer-files');
                    opts.paths.windowsTemplates = opts.paths.windowsTemplates || path.join(opts.paths.templates, 'windows');
                    opts.paths.windowsMeta = opts.paths.windowsMeta || path.join(opts.paths.windows, 'meta');
                    opts.paths.zxpFile = opts.paths.zxpFile || path.join(opts.paths.cwd, 'bundle.zxp');
                    opts.paths.macOsDistributionXmlFile = path.join(opts.paths.macOsMeta, 'distribution.xml');
                    opts.paths.macOsPostinstallFile = path.join(opts.paths.macOsScripts, 'postinstall');
                    opts.paths.macOsZxpFile = path.join(opts.paths.macOsScripts, 'bundle.zxp');
                    opts.paths.windowsZxpFile = path.join(opts.paths.windowsInstallerFiles, 'bundle.zxp');
                    opts.paths.macOsInstallerFile = path.join(opts.paths.macOsMeta, 'installer.pkg');
                    opts.paths.windowsNsisConfFile = path.join(opts.paths.windowsMeta, 'nsis.conf');
                    utils_1.rmrf(opts.paths.cwd);
                    fs_1.mkdirSync(opts.paths.cwd);
                    if (!(opts.src.indexOf('.zxp') > -1)) return [3, 1];
                    opts.paths.zxpFile = opts.src;
                    return [3, 3];
                case 1: return [4, createZXP(opts)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (os_1.platform() === 'darwin') {
                        packager_macos_1.createWindowsInstallerOnMacOs(opts);
                        packager_macos_1.createMacOsInstallerOnMacOs(opts);
                    }
                    else {
                        packager_windows_1.createWindowsInstallerOnWindows(opts);
                    }
                    return [2];
            }
        });
    });
}
exports.createInstallers = createInstallers;
function createZXP(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var certRes, signRes, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!opts.zxp)
                        opts.zxp = {};
                    if (!!opts.zxp.cert) return [3, 2];
                    if (!opts.zxp.certPassword)
                        opts.zxp.certPassword = 'password';
                    opts.zxp.cert = path.join(opts.paths.cwd, 'zxp-cert.p12');
                    return [4, selfSignedCertPromise({
                            country: opts.zxp.certCountry || 'US',
                            province: opts.zxp.certProvince || 'NY',
                            org: opts.zxp.certOrg || 'ACME',
                            name: opts.zxp.certName || 'ACME',
                            output: opts.zxp.cert,
                            password: opts.zxp.certPassword
                        })];
                case 1:
                    certRes = _a.sent();
                    console.log('Created self-signed certificate successfully');
                    _a.label = 2;
                case 2: return [4, signPromise({
                        input: opts.src,
                        output: opts.paths.zxpFile,
                        cert: opts.zxp.cert,
                        password: opts.zxp.certPassword,
                        timestamp: opts.zxp.timestamp
                    })];
                case 3:
                    signRes = _a.sent();
                    console.log('Signed package successfully');
                    if (opts.zxp.dest) {
                        utils_1.mkdirp(path.dirname(opts.zxp.dest));
                        child_process_1.execSync("cp \"" + opts.paths.zxpFile + "\" \"" + opts.zxp.dest + "\"");
                    }
                    return [3, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function selfSignedCertPromise(opts) {
    return new Promise(function (resolve, reject) {
        zxp_sign_cmd_1.selfSignedCert(opts, function (err, res) {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
}
function signPromise(opts) {
    return new Promise(function (resolve, reject) {
        zxp_sign_cmd_1.sign(opts, function (err, res) {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
}
