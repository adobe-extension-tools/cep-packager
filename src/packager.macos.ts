import * as path from 'path'
import { execSync } from 'child_process'
import { writeFileSync, chmodSync } from 'fs'
import { cp, cpr, mkdirp } from './utils'
import { quote } from 'shell-quote'
import postinstallTemplate from './templates/macos/postinstall'
import postinstallCsTemplate from './templates/macos/postinstallcs'
import distibutionTemplate from './templates/macos/distribution.xml'
import nsisTemplate from './templates/windows/nsis.conf'
import nsisCsTemplate from './templates/windows/nsiscs.conf'
import * as signcode from 'signcode'

export function createMacOsInstallerOnMacOs(opts) {
  createMacOsMeta(opts)
  createMacOsTemplates(opts)
  createMacOsInstallerFiles(opts)
  createMacOsScripts(opts)
  pkgbuild(opts)
  productbuild(opts)
}

function createMacOsMeta(opts) {
  console.log('-> createMacOsMeta')
  mkdirp(opts.paths.macOsMeta)
}

function createMacOsTemplates(opts) {
  console.log('-> createMacOsTemplates')
  // add distribution.xml
  writeFileSync(opts.paths.macOsDistributionXmlFile, opts.distibutionTemplate ? opts.distibutionTemplate(opts) : distibutionTemplate(opts))
}

function createMacOsInstallerFiles(opts) {
  console.log('-> createMacOsInstallerFiles')
  // create package root directory
  mkdirp(opts.paths.macOsInstallerFiles)
}

function createMacOsScripts(opts) {
  console.log('-> createMacOsScripts')
  mkdirp(opts.paths.macOsScripts)
  // add postinstall
  writeFileSync(
    opts.paths.macOsPostinstallFile,
    opts.postinstallTemplate
      ? opts.postinstallTemplate(opts)
      : (opts.cs ? postinstallCsTemplate(opts) : postinstallTemplate(opts))
  )
  chmodSync(opts.paths.macOsPostinstallFile, '0777')
  // add bundle.zxp
  cp(opts.paths.zxpFile, opts.paths.macOsZxpFile)
  // add ExManCmd
  if (!opts.cs) {
    const exManCmdSrc = path.join(__dirname, '../vendor/ExManCmd_mac.zip')
    // cpr(exManCmdSrc, opts.paths.macOsScripts)
    execSync(`unzip "${exManCmdSrc}" -d "${opts.paths.macOsScripts}/ExManCmd_mac"`)
  }
}

function pkgbuild(opts) {
  console.log('-> pkgbuild')
  let pkgbuildCmd = [
    ...((opts.macOs.keychain || opts.macOs.keychainPassword) && opts.unlockKeychain !== false ? [
      'security', '-v', 'unlock-keychain',
      ...(opts.macOs.keychainPassword ?
        ['-p', quote([opts.macOs.keychainPassword])] : []),
      quote([opts.macOs.keychain || 'login.keychain']),
      '&&',
    ] : []),
    '/usr/bin/pkgbuild',
    '--root', quote([opts.paths.macOsInstallerFiles]),
    '--scripts', quote([opts.paths.macOsScripts]),
    '--install-location', quote([`/tmp/.${opts.bundleId}-installer`]),
    ...(opts.macOs.keychain && opts.macOs.keychain !== 'login.keychain' ? ['--keychain', quote([opts.macOs.keychain || 'login.keychain'])] : []),
    '--identifier', quote([opts.bundleId]),
    '--timestamp',
    '--version', quote([opts.version]),
    ...(opts.macOs && opts.macOs.identifier ?
      ['--sign', quote([opts.macOs.identifier])] : []),
    quote([opts.paths.macOsInstallerFile])
  ].join(' ')
  opts.debug && console.log(pkgbuildCmd)
  const stdioOpts = opts.debug ? {stdio: 'inherit'} : { stdio: 'ignore' }
  const pkgbuildCmdResult = execSync(pkgbuildCmd, stdioOpts)
  opts.debug && console.log(pkgbuildCmdResult.toString())
}

function productbuild(opts) {
  console.log('-> productbuild')
  mkdirp(path.dirname(opts.macOs.dest))
  let productbuildCmd = [
    ...((opts.macOs.keychain || opts.macOs.keychainPassword) && opts.unlockKeychain !== false ? [
      'security', '-v', 'unlock-keychain',
      ...(opts.macOs.keychainPassword ?
        ['-p', quote([opts.macOs.keychainPassword])] : []),
      quote([opts.macOs.keychain || 'login.keychain']),
      '&&',
    ] : []),
    'productbuild',
    '--timestamp',
    ...(opts.macOs.keychain && opts.macOs.keychain !== 'login.keychain' ? ['--keychain', quote([opts.macOs.keychain || 'login.keychain'])] : []),
    '--distribution', quote([opts.paths.macOsDistributionXmlFile]),
    '--package-path', quote([opts.paths.macOsMeta]),
    '--resources', quote([opts.macOs.resources]),
    ...(opts.macOs && opts.macOs.identifier ?
      ['--sign', quote([opts.macOs.identifier])] : []),
    quote([opts.macOs.dest])
  ].join(' ')
  opts.debug && console.log(productbuildCmd)
  const productbuildCmdResult = execSync(productbuildCmd).toString()
  opts.debug && console.log(productbuildCmdResult)
}

export async function createWindowsInstallerOnMacOs(opts) {
  console.log('-> createWindowsInstallerOnMacOs')
  createWindowsMeta(opts)
  createWindowsTemplates(opts)
  createWindowsInstallerFiles(opts)
  mkdirp(path.dirname(opts.windows.dest))
  makensis(opts)
  signexe(opts)
}

function createWindowsMeta(opts) {
  console.log('-> createWindowsMeta')
  mkdirp(opts.paths.windowsMeta)
}

function createWindowsTemplates(opts) {
  console.log('-> createWindowsTemplates')
  writeFileSync(
    opts.paths.windowsNsisConfFile,
    opts.nsisTemplate
      ? opts.nsisTemplate(opts)
      : (opts.cs ? nsisCsTemplate(opts) : nsisTemplate(opts))
  )
}

function createWindowsInstallerFiles(opts) {
  console.log('-> createWindowsInstallerFiles')
  mkdirp(opts.paths.windowsInstallerFiles)
  if (!opts.cs) {
    const exManCmdSrc = path.join(__dirname, '../vendor/ExManCmd_win.zip')
    // cpr(exManCmdSrc, opts.paths.windowsInstallerFiles)
    execSync(`unzip "${exManCmdSrc}" -d "${opts.paths.windowsInstallerFiles}/ExManCmd_win"`)
  }
  cp(opts.paths.zxpFile, opts.paths.windowsZxpFile)
}

function makensis(opts) {
  console.log('-> makensis')
  const makensisResult = execSync([
    'cd', quote([opts.windows.resources]),
    '&&',
    '/usr/local/bin/makensis', quote([opts.paths.windowsNsisConfFile])
  ].join(' ')).toString()
  console.log(makensisResult)
}

function signexe(opts) {
  if (opts.windows.cert) {
    console.log('-> signexe')
    var options = {
      cert: opts.windows.cert,
      password: opts.windows.certPassword,
      overwrite: true,
      path: opts.windows.dest,
      site: opts.windows.site, 
      name: opts.name
    }
    signcode.sign(options, function (error) {
      if (error) {
        console.error('Signing failed', error.message)
      } else {
        console.log(options.path + ' is now signed')
      }
    })
  }
}
