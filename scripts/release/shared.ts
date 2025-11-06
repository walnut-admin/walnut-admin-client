import { execSync } from 'node:child_process'
import process from 'node:process'

export function run(cmd: string): string {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim()
}

export function getVersionArg(): string | null {
  const args = process.argv.slice(2)
  const vFlag = args.find(a => a === '-v' || a === '--version')
  const index = vFlag ? args.indexOf(vFlag) + 1 : 0
  const versionArg = index > 0 ? args[index] : args[0]
  return versionArg?.replace(/^v/, '') ?? null
}
