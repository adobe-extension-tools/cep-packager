#!/usr/bin/env node
import * as fs from 'fs'
import * as minimist from 'minimist'
import * as path from 'path'

import createInstallers from '..'

function run() {
  const projectDir = process.cwd()
  const packageJson = require(path.join(projectDir, 'package.json'))
  const cepConfigPath = path.join(projectDir, 'cep-config.js')
  const cepConfigExists = fs.existsSync(cepConfigPath)
  if (cepConfigExists) {
    const config = require(cepConfigPath)
    return createInstallers(config.packager)
  } else if (packageJson.cep) {
    const packageJson = require(`${projectDir}/package.json`)
    const config = packageJson.cep.installers || {}
    const defaults = {
      src: path.join(projectDir, 'dist'),
      bundleId: packageJson.cep.id || 'com.mycompany.myproduct',
      macOs: {
        resources: path.join(projectDir, 'node_modules', 'cep-packager', 'resources', 'macos'),
        dest: path.join(projectDir, 'archive', `${packageJson.name}-${packageJson.version}.pkg`)
      },
      windows: {
        resources: path.join(projectDir, 'node_modules', 'cep-packager', 'resources', 'windows'),
        dest: path.join(projectDir, 'archive', `${packageJson.name}-${packageJson.version}.exe`)
      }
    }
    Object.keys(defaults).forEach((key) => {
      if (!config.hasOwnProperty(key)) {
        config[key] = defaults[key]
      }
    })
    return createInstallers(config)
  } else {
    const argv = minimist(process.argv.slice(2));

    const requiredOptions = [
      'name',
      'bundle-id',
      'version',
      'macos-resources',
      'windows-resources',
      'macos-dest',
      'windows-dest'
    ]

    requiredOptions.forEach(requiredOption => {
      const requiredOptionAsEnv = 'PACKAGE_' + requiredOption.toUpperCase().replace(/-/g, '_')
      if (!(argv[requiredOption] || process.env[requiredOptionAsEnv])) {
        console.log(`The "${requiredOption}" option is missing and is required!`)
        argv.help = true
      }
    })

    if(!(argv['_'][0] || !process.env.PACKAGE_SRC)) {
      console.log(`The "SRC" option is missing and is required!`)
      argv.help = true
    }

    if (argv.help) {
      console.log(`
    usage: cep-packager [OPTION]... SRC

    Options
      --name\t\t\tName of the package
      --bundle-id\t\t\tBundle identifier (com.yourcompany.yourproduct)
      --version\t\t\tVersion of the package
      --macos-resources\t\tPath to folder containing macOS installer resources
      --macos-dest\t\tDestination of macOS installer (.pkg)
      --windows-dest\t\tDestination of windows installer (.exe)
      --windows-resources\t\tPath to folder containing windows installer resources
      --windows-cert\t\t[optional] Sign the executable with this certificate (.p12)
      --windows-cert-password\t[optional] Unlock the certificate with this password
      --zxp-cert\t\t\t[optional] Path to zxp certificate (.p12)
      --zxp-cert-password\t\t[optional] Password of the zxp certificate
      --zxp-dest\t\t\t[optional] Copy the zxp into this location
      --macos-keychain\t\t[optional] Name of the keychain to unlock
      --macos-keychain-password\t[optional] Password of the keychain to unlock
      --macos-identifier\t\t[optional] Identifier of signing identity (Developer ID Installer: Your Username)
    `)
      process.exit(1)
    }

    const src = argv['_'].length && argv['_'][0]

    return createInstallers({
      name: argv['name'] || process.env.PACKAGE_NAME,
      bundleId: argv['bundle-id'] ||process.env.PACKAGE_BUNDLE_ID,
      version: argv['version'] || process.env.PACKAGE_VERSION,
      src: src || process.env.PACKAGE_SRC,
      zxp: {
        cert: argv['zxp-cert'] || process.env.PACKAGE_ZXP_CERT,
        certPassword: argv['zxp-cert-password'] || process.env.PACKAGE_ZXP_CERT_PASSWORD,
        dest: argv['zxp-dest'] || process.env.PACKAGE_ZXP_DEST
      },
      macOs: {
        dest: argv['macos-dest'] || process.env.PACKAGE_MACOS_DEST,
        keychain: argv['macos-keychain'] || process.env.PACKAGE_MACOS_KEYCHAIN,
        keychainPassword: argv['macos-keychain-password'] || process.env.PACKAGE_MACOS_KEYCHAIN_PASSWORD,
        identifier: argv['macos-identifier'] || process.env.PACKAGE_MACOS_DEVELOPER_IDENTIFIER,
        resources: argv['macos-resources'] || process.env.PACKAGE_MACOS_RESOURCES
      },
      windows: {
        dest: argv['windows-dest'] || process.env.PACKAGE_WINDOWS_DEST,
        resources: argv['windows-resources'] || process.env.PACKAGE_WINDOWS_RESOURCES,
        cert: argv['windows-cert'] || process.env.PACKAGE_WINDOWS_CERT,
        certPassword: argv['windows-cert-password'] || process.env.PACKAGE_WINDOWS_CERT_PASSWORD
      }
    })
  }
}
run()