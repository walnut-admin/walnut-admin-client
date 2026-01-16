import { version } from '~build/package'

// TODO need to delete after several versions of release
localStorage.removeItem('__APP_MIGRATION_VERSION__')

const VERSION_KEY = '__APP_VERSION__'

/**
 * Configures which versions require cache clearance.
 * - 'all' = Clear cache on any version change
 * - Specific version = Clear cache only when updating to that version
 */
const CLEAR_ON_VERSIONS: string[] = [
  '1.13.0',
]

export function setupStorageMigrations() {
  const storedVersion = localStorage.getItem(VERSION_KEY)

  // first run, record version and skip clear
  if (!storedVersion) {
    localStorage.setItem(VERSION_KEY, version)
    console.log(`[storage-migration] First run, persisted version ${version}`)
    return
  }

  // version unchanged, skip clear
  if (storedVersion === version) {
    console.log(`[storage-migration] Version unchanged (${version}), skipping`)
    return
  }

  // version changed: check if clear is needed
  const shouldClear = CLEAR_ON_VERSIONS.includes('all') || CLEAR_ON_VERSIONS.includes(version)

  if (shouldClear) {
    console.log(`[storage-migration] Version changed: ${storedVersion} → ${version}, clearing all storage`)

    // clear localStorage
    localStorage.clear()

    // clear sessionStorage
    sessionStorage.clear()

    // clear backend cookies (async, doesn't block startup)
    fetch('/api/reset-cookies', { method: 'POST' }).catch((err) => {
      console.error('[storage-migration] Failed to clear backend cookies:', err)
    })

    console.log(`[storage-migration] All storage cleared`)
  }
  else {
    console.log(`[storage-migration] Version changed: ${storedVersion} → ${version}, but no clear needed`)
  }

  // update version in localStorage
  localStorage.setItem(VERSION_KEY, version)
}
