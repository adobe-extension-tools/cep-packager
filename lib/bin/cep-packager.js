#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs = require("fs");
var minimist = require("minimist");
var path = require("path");
var __1 = require("..");
function run() {
    var projectDir = process.cwd();
    var packageJson = require(path.join(projectDir, 'package.json'));
    var cepConfigPath = path.join(projectDir, 'cep-config.js');
    var cepConfigExists = fs.existsSync(cepConfigPath);
    if (cepConfigExists) {
        var config = require(cepConfigPath);
        return __1["default"](config);
    }
    else if (packageJson.cep) {
        var packageJson_1 = require(projectDir + "/package.json");
        var config_1 = packageJson_1.cep.installers || {};
        var defaults_1 = {
            src: path.join(projectDir, 'dist'),
            bundleId: packageJson_1.cep.id || 'com.mycompany.myproduct',
            macOs: {
                resources: path.join(projectDir, 'node_modules', 'cep-packager', 'resources', 'macos'),
                dest: path.join(projectDir, 'archive', packageJson_1.name + "-" + packageJson_1.version + ".pkg")
            },
            windows: {
                resources: path.join(projectDir, 'node_modules', 'cep-packager', 'resources', 'windows'),
                dest: path.join(projectDir, 'archive', packageJson_1.name + "-" + packageJson_1.version + ".exe")
            }
        };
        Object.keys(defaults_1).forEach(function (key) {
            if (!config_1.hasOwnProperty(key)) {
                config_1[key] = defaults_1[key];
            }
        });
        return __1["default"](config_1);
    }
    else {
        var argv_1 = minimist(process.argv.slice(2));
        var requiredOptions = [
            'name',
            'bundle-id',
            'version',
            'macos-resources',
            'windows-resources',
            'macos-dest',
            'windows-dest'
        ];
        requiredOptions.forEach(function (requiredOption) {
            var requiredOptionAsEnv = 'PACKAGE_' + requiredOption.toUpperCase().replace(/-/g, '_');
            if (!(argv_1[requiredOption] || process.env[requiredOptionAsEnv])) {
                console.log("The \"" + requiredOption + "\" option is missing and is required!");
                argv_1.help = true;
            }
        });
        if (!(argv_1['_'][0] || !process.env.PACKAGE_SRC)) {
            console.log("The \"SRC\" option is missing and is required!");
            argv_1.help = true;
        }
        if (argv_1.help) {
            console.log("\n    usage: cep-packager [OPTION]... SRC\n\n    Options\n      --name\t\t\tName of the package\n      --bundle-id\t\t\tBundle identifier (com.yourcompany.yourproduct)\n      --version\t\t\tVersion of the package\n      --macos-resources\t\tPath to folder containing macOS installer resources\n      --macos-dest\t\tDestination of macOS installer (.pkg)\n      --windows-dest\t\tDestination of windows installer (.exe)\n      --windows-resources\t\tPath to folder containing windows installer resources\n      --windows-cert\t\t[optional] Sign the executable with this certificate (.p12)\n      --windows-cert-password\t[optional] Unlock the certificate with this password\n      --zxp-cert\t\t\t[optional] Path to zxp certificate (.p12)\n      --zxp-cert-password\t\t[optional] Password of the zxp certificate\n      --zxp-dest\t\t\t[optional] Copy the zxp into this location\n      --macos-keychain\t\t[optional] Name of the keychain to unlock\n      --macos-keychain-password\t[optional] Password of the keychain to unlock\n      --macos-identifier\t\t[optional] Identifier of signing identity (Developer ID Installer: Your Username)\n    ");
            process.exit(1);
        }
        return __1["default"]({
            name: argv_1['name'] || process.env.PACKAGE_NAME,
            bundleId: argv_1['bundle-id'] || process.env.PACKAGE_BUNDLE_ID,
            version: argv_1['version'] || process.env.PACKAGE_VERSION,
            src: argv_1['_'] || process.env.PACKAGE_SRC,
            zxp: {
                cert: argv_1['zxp-cert'] || process.env.PACKAGE_ZXP_CERT,
                certPassword: argv_1['zxp-cert-password'] || process.env.PACKAGE_ZXP_CERT_PASSWORD,
                dest: argv_1['zxp-dest'] || process.env.PACKAGE_ZXP_DEST
            },
            macOs: {
                dest: argv_1['macos-dest'] || process.env.PACKAGE_MACOS_DEST,
                keychain: argv_1['macos-keychain'] || process.env.PACKAGE_MACOS_KEYCHAIN,
                keychainPassword: argv_1['macos-keychain-password'] || process.env.PACKAGE_MACOS_KEYCHAIN_PASSWORD,
                identifier: argv_1['macos-identifier'] || process.env.PACKAGE_MACOS_DEVELOPER_IDENTIFIER,
                resources: argv_1['macos-resources'] || process.env.PACKAGE_MACOS_RESOURCES
            },
            windows: {
                dest: argv_1['windows-dest'] || process.env.PACKAGE_WINDOWS_DEST,
                resources: argv_1['windows-resources'] || process.env.PACKAGE_WINDOWS_RESOURCES,
                cert: argv_1['windows-cert'] || process.env.PACKAGE_WINDOWS_CERT,
                certPassword: argv_1['windows-cert-password'] || process.env.PACKAGE_WINDOWS_CERT_PASSWORD
            }
        });
    }
}
run();
