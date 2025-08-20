import { isProd } from '@/utils/constant/vue'
import { AppPersistEncryption } from '@/utils/crypto'
import { compare } from 'compare-versions'
import { version } from '~build/package'
import { getStorageKey } from './shared'

// TODO fetch from api
const migrations: Record<string, { key: string, action: 'remove' | 'update', newValue?: string }[]> = {
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
      const { key: originalKey, action, newValue } = rule

      // Apply rule for both preset and non-preset keys
      for (const usePreset of [true, false]) {
        const realKey = usePreset ? getStorageKey(originalKey) : originalKey

        // Apply rule for both localStorage and sessionStorage
        for (const storage of [localStorage, sessionStorage]) {
          const raw = storage.getItem(realKey)

          // If no data exists, only 'remove' rules can run; others are skipped
          if (!raw && action !== 'remove')
            continue

          let data: any

          // Determine whether encryption is enabled for this key
          const useEncrypt = (() => {
            try {
              const temp = JSON.parse(raw || '{}')
              return typeof temp.enc === 'boolean' ? temp.enc : isProd()
            }
            catch {
              return isProd()
            }
          })()

          // Decrypt and parse stored data
          try {
            data = raw ? JSON.parse(useEncrypt ? AppPersistEncryption.decrypt(raw) : raw) : null
          }
          catch {
            // Corrupted data: skip this key
            continue
          }

          // For 'update' rules, skip if data version is already >= rule version
          if (action === 'update' && (!data || compare(data._v ?? '0.0.0', ver, '>=')))
            continue

          switch (action) {
            case 'remove':
              storage.removeItem(realKey)
              console.log(`[storage-migration] Removed ${realKey}`)
              break

            case 'update': {
              if (newValue == null)
                break

              const updated = {
                v: newValue, // new persisted value
                _v: version, // mark migration version
                e: data?.e ?? null, // preserve expiration if exists
                enc: useEncrypt, // preserve encryption flag
              }

              const serialized = JSON.stringify(updated)
              storage.setItem(
                realKey,
                useEncrypt ? AppPersistEncryption.encrypt(serialized)! : serialized,
              )
              console.log(`[storage-migration] Updated ${realKey} to new value`)
              break
            }
          }
        }
      }
    }
  }

  // After all migrations complete, record the current version
  localStorage.setItem(MIGRATION_DONE_KEY, version)
  console.log(`[storage-migration] All migrations completed, recorded version ${version}`)
}
