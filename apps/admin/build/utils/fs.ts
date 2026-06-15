import { promises as fs } from 'node:fs'
import { EOL } from 'node:os'
// import { EOL } from 'node:os'
import { BuildUtilsLog } from './log'

const stage = 'File'

export async function BuildUtilsReadFile(path: string) {
  BuildUtilsLog(`Reading File: ${path}`, stage)
  return await fs.readFile(path, 'utf8')
}

export async function BuildUtilsWriteFile(path: string, data: any) {
  BuildUtilsLog(`Writing data into File: ${path}`, stage)
  const res = await fs.writeFile(path, data, 'utf8')
  await fs.appendFile(path, EOL, 'utf8')
  // LINK https://unix.stackexchange.com/questions/18743/whats-the-point-in-adding-a-new-line-to-the-end-of-a-file
  // fs.appendFile(path, EOL, 'utf8')
  // fs.appendFile(path, EOL, 'utf8')
  return res
}
