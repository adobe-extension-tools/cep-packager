#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var index_1 = require("../index");
var minimist = require("minimist");
var projectDir = process.cwd();
try {
    var config = require(projectDir + "/cep-config");
    index_1["default"](config.packager);
}
catch (err) {
    var argv_1 = minimist(process.argv.slice(2));
    var requiredOptions = [
        'name',
        'bundle-id',
        'version',
        'macos-resources',
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
    if (argv_1.help) {
        console.log("\n  usage: cep-packager [OPTION]... SRC\n\n  Options\n    --name\t\t\tName of the package\n    --bundle-id\t\t\tBundle identifier (com.yourcompany.yourproduct)\n    --version\t\t\tVersion of the package\n    --macos-resources\t\tPath to folder containing installer resources\n    --macos-dest\t\t\tDestination of macOS installer (.pkg)\n    --windows-dest\t\tDestination of windows installer (.exe)\n    --zxp-cert\t\t\t[optional] Path to zxp certificate (.p12)\n    --zxp-cert-password\t\t[optional] Password of the zxp certificate\n    --macos-keychain\t\t[optional] Name of the keychain to unlock\n    --macos-keychain-password\t[optional] Password of the keychain to unlock\n    --macos-identifier\t\t[optional] Identifier of signing identity (Developer ID Installer: Your Username)\n  ");
        process.exit(1);
    }
    index_1["default"]({
        name: argv_1['name'] || process.env.PACKAGE_NAME,
        bundleId: argv_1['bundle-id'] || process.env.PACKAGE_BUNDLE_ID,
        version: argv_1['version'] || process.env.PACKAGE_VERSION,
        src: argv_1['_'],
        zxp: {
            cert: argv_1['zxp-cert'] || process.env.PACKAGE_ZXP_CERT,
            certPassword: argv_1['zxp-cert-password'] || process.env.PACKAGE_ZXP_CERT_PASSWORD
        },
        macOs: {
            dest: argv_1['macos-dest'] || process.env.PACKAGE_MACOS_DEST,
            keychain: argv_1['macos-keychain'] || process.env.PACKAGE_MACOS_KEYCHAIN,
            keychainPassword: argv_1['macos-keychain-password'] || process.env.PACKAGE_MACOS_KEYCHAIN_PASSWORD,
            identifier: argv_1['macos-identifier'] || process.env.PACKAGE_MACOS_DEVELOPER_IDENTIFIER,
            resources: argv_1['macos-resources'] || process.env.PACKAGE_MACOS_RESOURCES
        },
        windows: {
            dest: argv_1['windows-dest'] || process.env.PACKAGE_WINDOWS_DEST
        }
    });
}
