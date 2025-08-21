import { compare } from 'compare-versions'
import { version } from '~build/package'
import { getStorageKey } from './shared'

// TODO fetch from api
const migrations: Record<string, { key: string, action: 'remove' }[]> = {
  // '1.2.0': [
  //   {
  //     key: AppConstPersistKey.REMEMBER,
  //     action: 'update',
  //     newValue: '123',
  //   },
  // ],
  // '1.2.1': [
  //   {
  //     key: AppConstPersistKey.REMEMBER,
  //     action: 'update',
  //     newValue: '3213',
  //   },
  //   {
  //     key: '222',
  //     action: 'remove',
  //   },
  // ],
  // '1.2.2': [
  //   {
  //     key: AppConstPersistKey.REMEMBER,
  //     action: 'update',
  //     newValue: 'qqq',
  //   },
  // ],
  // '1.2.3': [
  //   {
  //     key: '333',
  //     action: 'update',
  //     newValue: '333',
  //   },
  // ],
}

const MIGRATION_DONE_KEY = `__APP_MIGRATION_VERSION__`

export function setupStorageMigrations() {
  const lastMigrationVersion = localStorage.getItem(MIGRATION_DONE_KEY)

  // First run: persist current version and skip all migrations
  if (!lastMigrationVersion) {
    localStorage.setItem(MIGRATION_DONE_KEY, version)
    console.log(`[storage-migration] First run, persisted version ${version}, skip migrations`)
    return
  }

  // Skip if current version is not greater than the last migrated version
  if (!compare(version, lastMigrationVersion, '>')) {
    console.log(`[storage-migration] Already migrated to ${lastMigrationVersion}, skipping`)
    return
  }

  // Build a sorted list of available migration versions
  const allVersions = Object.keys(migrations)
    .filter(v => compare(v, '0.0.0', '>')) // ignore invalid versions
    .sort((a, b) => (compare(a, b, '>') ? 1 : -1)) // ascending semver order

  // Iterate over each version that needs to be applied
  for (const ver of allVersions) {
    // Skip versions already applied (extra safeguard)
    if (lastMigrationVersion && !compare(ver, lastMigrationVersion, '>'))
      continue

    const rules = migrations[ver] ?? []
    for (const rule of rules) {
      const { key: originalKey, action } = rule

      // Apply rule for both preset and non-preset keys
      for (const usePreset of [true, false]) {
        const realKey = usePreset ? getStorageKey(originalKey) : originalKey

        // Apply rule for both localStorage and sessionStorage
        for (const storage of [localStorage, sessionStorage]) {
          const raw = storage.getItem(realKey)

          // If no data exists, only 'remove' rules can run; others are skipped
          if (!raw && action !== 'remove')
            continue

          switch (action) {
            case 'remove':
              storage.removeItem(realKey)
              console.log(`[storage-migration] Removed ${realKey}`)
              break
          }
        }
      }
    }
  }

  // After all migrations complete, record the current version
  localStorage.setItem(MIGRATION_DONE_KEY, version)
  console.log(`[storage-migration] All migrations completed, recorded version ${version}`)
}
