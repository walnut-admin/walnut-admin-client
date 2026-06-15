import cp from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
import chalk from 'chalk'

import { getNow } from 'easy-fns-ts'
import pkg from '../../package.json'

function title(stage: string) {
  return chalk.magenta.bgBlack(
    `[${pkg.name.toUpperCase()}] - [${getNow()}] - [${stage}]`,
  )
}

export function BuildUtilsLog(msg: string, stage = 'Log') {
  console.log(`${title(stage)}: ${msg}`)
}

export function BuildUtilsWarn(warns: string) {
  console.warn(chalk.yellow(`[${pkg.name.toUpperCase()} Warning] - [${getNow()}] \n ${warns}`))
}

export function writeIntoLog(title: string, command: string, path: string) {
  const prefix = (msg: string, emoji: string) =>
    `
/**
 * ==============================================
 * ==============================================
 * ${title} - ${msg} - ${emoji} - ${getNow()}
 * ==============================================
 * ==============================================
 */
`

  const log_file = fs.createWriteStream(path, {
    flags: 'w',
  })

  const start = Date.now()

  cp.exec(command, (error, stdout, stderr) => {
    prefix(`Excuting command: ${command}`, '⚡⚡⚡⚡⚡')

    const end = Date.now()

    const cost = new Date(end - start).getSeconds()

    BuildUtilsLog(chalk.blue(`${title} done in ${cost}s`))

    if (error) {
      process.exitCode = 1
      log_file.write(
        prefix('Error', '😈😈😈😈😈') + JSON.stringify(error),
        () => {
          // // recover icon file if failed
          // cp.execSync('npm run postbuild')

          BuildUtilsLog(
            chalk.red.bgBlack(`${title} Failed, see more in ${path}`),
          )
        },
      )
    }
    else {
      BuildUtilsLog(chalk.green.bgBlack(`${title} Successfully! ✨✨✨✨✨ `))
    }

    if (stdout) {
      log_file.write(prefix('Std Out', '✨✨✨✨✨') + stdout, () => {
        BuildUtilsLog(
          chalk.magenta.bgBlack(`${title} Std out, see more in ${path}`),
        )
      })
    }

    if (stderr) {
      log_file.write(prefix('Std Err', '💊💊💊💊💊') + stderr, () => {
        BuildUtilsLog(
          chalk.yellow.bgBlack(`${title} Std Error, see more in ${path}`),
        )
      })
    }
  })
}
