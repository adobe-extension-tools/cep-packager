import { readFileSync, writeFileSync } from 'fs'
import * as rimraf from 'rimraf'
import * as mkdirplib from 'mkdirp'
import { execSync } from 'child_process'

export function copyAndReplace(from, to, replace) {
  let contents = readFileSync(from, 'utf8')
  Object.keys(replace).forEach(key => {
    contents = contents.replace(new RegExp(`${key}`, 'g'), replace[key])
  })
  writeFileSync(to, contents)
}

export function rmrf(path) {
  rimraf.sync(path)
}

export function mkdirp(path) {
  mkdirplib.sync(path)
}

export function cp(from, to) {
  execSync(`cp ${from} ${to}`)
}

export function cpr(from, to) {
  execSync(`cp -r ${from} ${to}`)
}
