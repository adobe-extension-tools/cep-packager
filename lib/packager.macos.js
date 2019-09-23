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
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var utils_1 = require("./utils");
var shell_quote_1 = require("shell-quote");
var postinstall_1 = require("./templates/macos/postinstall");
var postinstallcs_1 = require("./templates/macos/postinstallcs");
var distribution_xml_1 = require("./templates/macos/distribution.xml");
var nsis_conf_1 = require("./templates/windows/nsis.conf");
var nsiscs_conf_1 = require("./templates/windows/nsiscs.conf");
var signcode = require("signcode");
function createMacOsInstallerOnMacOs(opts) {
    createMacOsTemplates(opts);
    createMacOsInstallerFiles(opts);
    pkgbuild(opts);
    productbuild(opts);
}
exports.createMacOsInstallerOnMacOs = createMacOsInstallerOnMacOs;
function createMacOsMeta(opts) {
    console.log('-> createMacOsMeta');
    utils_1.mkdirp(opts.paths.macOsMeta);
}
function createMacOsTemplates(opts) {
    console.log('-> createMacOsTemplates');
    fs_1.writeFileSync(opts.paths.macOsDistributionXmlFile, opts.distibutionTemplate ? opts.distibutionTemplate(opts) : distribution_xml_1["default"](opts));
}
function createMacOsInstallerFiles(opts) {
    console.log('-> createMacOsInstallerFiles');
    utils_1.mkdirp(opts.paths.macOsInstallerFiles);
}
function createMacOsScripts(opts) {
    console.log('-> createMacOsScripts');
    utils_1.mkdirp(opts.paths.macOsScripts);
    fs_1.writeFileSync(opts.paths.macOsPostinstallFile, opts.postinstallTemplate
        ? opts.postinstallTemplate(opts)
        : (opts.cs ? postinstallcs_1["default"](opts) : postinstall_1["default"](opts)));
    fs_1.chmodSync(opts.paths.macOsPostinstallFile, '0777');
    utils_1.cp(opts.paths.zxpFile, opts.paths.macOsZxpFile);
    if (!opts.cs) {
        var exManCmdSrc = path.join(__dirname, '../vendor/ExManCmd_mac');
        utils_1.cpr(exManCmdSrc, opts.paths.macOsScripts);
    }
}
function pkgbuild(opts) {
    console.log('-> pkgbuild');
    var pkgbuildCmd = (opts.macOs.keychain || opts.macOs.keychainPassword ? [
        'security', '-v', 'unlock-keychain'
    ].concat((opts.macOs.keychainPassword ?
        ['-p', shell_quote_1.quote([opts.macOs.keychainPassword])] : []), [
        shell_quote_1.quote([opts.macOs.keychain || 'login.keychain']),
        '&&',
    ]) : []).concat([
        '/usr/bin/pkgbuild',
        '--root', shell_quote_1.quote([opts.paths.zxpContents]),
        '--scripts', shell_quote_1.quote([opts.paths.macOsScripts]),
        '--install-location', shell_quote_1.quote(["Library/Application Support/Adobe/CEP/extensions/" + opts.bundleId]),
        '--identifier', shell_quote_1.quote([opts.bundleId]),
        '--version', shell_quote_1.quote([opts.version])
    ], (opts.macOs && opts.macOs.identifier ?
        ['--sign', shell_quote_1.quote([opts.macOs.identifier])] : []), [
        shell_quote_1.quote([opts.paths.macOsInstallerFile])
    ]).join(' ');
    var stdioOpts = opts.debug ? undefined : { stdio: 'ignore' };
    var pkgbuildCmdResult = child_process_1.execSync(pkgbuildCmd, stdioOpts);
    opts.debug && console.log(pkgbuildCmdResult.toString());
}
function productbuild(opts) {
    console.log('-> productbuild');
    utils_1.mkdirp(path.dirname(opts.macOs.dest));
    var productbuildCmd = (opts.macOs.keychain || opts.macOs.keychainPassword ? [
        'security', '-v', 'unlock-keychain'
    ].concat((opts.macOs.keychainPassword ?
        ['-p', shell_quote_1.quote([opts.macOs.keychainPassword])] : []), [
        shell_quote_1.quote([opts.macOs.keychain || 'login.keychain']),
        '&&',
    ]) : []).concat([
        'productbuild',
        '--distribution', shell_quote_1.quote([opts.paths.macOsDistributionXmlFile]),
        '--package-path', shell_quote_1.quote([opts.paths.macOsMeta]),
        '--resources', shell_quote_1.quote([opts.macOs.resources])
    ], (opts.macOs && opts.macOs.identifier ?
        ['--sign', shell_quote_1.quote([opts.macOs.identifier])] : []), [
        shell_quote_1.quote([opts.macOs.dest])
    ]).join(' ');
    console.log(productbuildCmd);
    var productbuildCmdResult = child_process_1.execSync(productbuildCmd).toString();
    console.log(productbuildCmdResult);
}
function createWindowsInstallerOnMacOs(opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('-> createWindowsInstallerOnMacOs');
            createWindowsMeta(opts);
            createWindowsTemplates(opts);
            createWindowsInstallerFiles(opts);
            utils_1.mkdirp(path.dirname(opts.windows.dest));
            makensis(opts);
            signexe(opts);
            return [2];
        });
    });
}
exports.createWindowsInstallerOnMacOs = createWindowsInstallerOnMacOs;
function createWindowsMeta(opts) {
    console.log('-> createWindowsMeta');
    utils_1.mkdirp(opts.paths.windowsMeta);
}
function createWindowsTemplates(opts) {
    console.log('-> createWindowsTemplates');
    fs_1.writeFileSync(opts.paths.windowsNsisConfFile, opts.nsisTemplate
        ? opts.nsisTemplate(opts)
        : (opts.cs ? nsiscs_conf_1["default"](opts) : nsis_conf_1["default"](opts)));
}
function createWindowsInstallerFiles(opts) {
    console.log('-> createWindowsInstallerFiles');
    utils_1.mkdirp(opts.paths.windowsInstallerFiles);
    if (!opts.cs) {
        var exManCmdSrc = path.join(__dirname, '../vendor/ExManCmd_win');
        utils_1.cpr(exManCmdSrc, opts.paths.windowsInstallerFiles);
    }
    utils_1.cp(opts.paths.zxpFile, opts.paths.windowsZxpFile);
}
function makensis(opts) {
    console.log('-> makensis');
    var makensisResult = child_process_1.execSync([
        'cd', shell_quote_1.quote([opts.windows.resources]),
        '&&',
        '/usr/local/bin/makensis', shell_quote_1.quote([opts.paths.windowsNsisConfFile])
    ].join(' ')).toString();
    console.log(makensisResult);
}
function signexe(opts) {
    if (opts.windows.cert) {
        console.log('-> signexe');
        var options = {
            cert: opts.windows.cert,
            password: opts.windows.certPassword,
            overwrite: true,
            path: opts.windows.dest,
            site: opts.windows.site,
            name: opts.name
        };
        signcode.sign(options, function (error) {
            if (error) {
                console.error('Signing failed', error.message);
            }
            else {
                console.log(options.path + ' is now signed');
            }
        });
    }
}
