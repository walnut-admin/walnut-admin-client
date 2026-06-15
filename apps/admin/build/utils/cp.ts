import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { BuildUtilsLog } from './log'

const promisifyExec = promisify(exec)

export async function BuildUtilsExec(file: string) {
  const { stdout, stderr } = await promisifyExec(file)

  BuildUtilsLog(stdout)

  if (stderr)
    return false

  return true
}
