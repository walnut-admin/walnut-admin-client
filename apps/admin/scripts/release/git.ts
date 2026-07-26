import process from 'node:process'
import { getVersionArg, run } from './shared'

async function main() {
  try {
    console.log('🚀 开始推送tag和release...')

    // 1️⃣ 获取版本号
    const version = getVersionArg()
    if (!version)
      throw new Error('❌ 缺少版本号参数，例如：pnpm release -v 1.2.3')
    if (!/^\d+\.\d+\.\d+$/.test(version))
      throw new Error(`❌ 无效版本号格式: ${version}，应为 x.y.z`)

    console.log(`📄 发布版本: v${version}`)

    // 2️⃣ Git 提交与打标签（原逻辑保留注释）
    console.log('💾 提交变更...')
    run('git add .')
    try {
      run(`git commit -m "chore: release v${version}"`)
    }
    catch {
      console.log('⚠️ 无需提交（没有变更）')
    }

    const changelogFile = 'changelog-latest.md'
    run(`git tag -a v${version} -F ${changelogFile}`)
    console.log(`🏷️ 创建标签 v${version}`)

    const branch = run('git rev-parse --abbrev-ref HEAD')
    console.log(`📤 推送到远程分支 ${branch}...`)
    run(`git push origin ${branch}`)
    run(`git push origin v${version}`)

    console.log('✅ 推送tag和release完成！')
  }
  catch (err: any) {
    console.error('❌ 推送失败:', err.message)
    process.exit(1)
  }
}

main()
