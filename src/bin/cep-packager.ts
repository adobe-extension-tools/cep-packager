#!/usr/bin/env node

import createInstallers from '../index'
import * as minimist from 'minimist'
const projectDir = process.cwd()
try {
  const config = require(`${projectDir}/cep-config`)
  createInstallers(config.packager)
} catch (err) {
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

  createInstallers({
    name: argv['name'] || process.env.PACKAGE_NAME,
    bundleId: argv['bundle-id'] ||process.env.PACKAGE_BUNDLE_ID,
    version: argv['version'] || process.env.PACKAGE_VERSION,
    src: argv['_'] || process.env.PACKAGE_SRC,
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
