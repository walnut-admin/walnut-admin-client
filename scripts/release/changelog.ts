import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { getVersionArg, run } from './shared'

async function main() {
  try {
    console.log('🚀 开始生成更新日志...')

    // 1️⃣ 获取版本号
    const version = getVersionArg()
    if (!version)
      throw new Error('❌ 缺少版本号参数，例如：pnpm release -v 1.2.3')
    if (!/^\d+\.\d+\.\d+$/.test(version))
      throw new Error(`❌ 无效版本号格式: ${version}，应为 x.y.z`)

    console.log(`📄 发布版本: v${version}`)

    // 2️⃣ 找上一个 tag
    let lastTag = ''
    try {
      lastTag = run('git describe --tags --abbrev=0')
      console.log(`🧩 上一个 tag: ${lastTag}`)
    }
    catch {
      console.log('🧩 没有上一个 tag，将从初始提交开始生成 changelog')
    }

    // 3️⃣ 使用 git-cliff 生成 changelog
    console.log('🧱 使用 git-cliff 生成 changelog...')
    const range = lastTag ? `${lastTag}..HEAD` : ''
    const changelogFile = 'changelog-latest.md'
    const date = new Date().toISOString().split('T')[0]
    const title = `## [v${version}] - ${date}\n\n`

    // 生成正文
    let body = run(`git cliff ${range} --tag v${version} --config scripts/release/cliff.toml`)
    // 如果 git-cliff 输出里已经包含了顶层的版本标题（例如 ## [Unreleased]），去掉它
    // 以免与我们下面手动生成的 title 重复。
    // 匹配形如: ## [Unreleased] 或 ## [v1.2.3]（以及随后的一个空行），然后移除
    body = body.replace(/^#\s*\[[^\]]*\][^\r\n]*(?:\r?\n){1,2}/, '').trim()
    await fs.writeFile(changelogFile, `${title}${body}\n`)
    console.log(`✅ 已生成 ${changelogFile}`)

    // 4️⃣ 更新 package.json
    const pkgPath = path.resolve('package.json')
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))
    pkg.version = version
    await fs.writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    console.log('📦 已更新 package.json')

    console.log('✅ 更新日志已生成！')
  }
  catch (err: any) {
    console.error('❌ 生成失败:', err.message)
    process.exit(1)
  }
}

main()
