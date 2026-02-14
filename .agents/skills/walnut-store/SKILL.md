---
name: walnut-store
description: Walnut Admin Client Pinia store development patterns. Use when creating or modifying Pinia stores in the walnut-admin-client project. Provides patterns for store naming, structure, persistence, and cross-store communication.
---

# Walnut Admin Store Development

This skill guides you through creating Pinia stores following Walnut Admin's patterns.

## Store Structure

Stores are organized in `src/store/modules/`:

```
store/
├── modules/
│   ├── app/
│   │   ├── app-menu.ts
│   │   ├── app-tab.ts
│   │   └── ...
│   ├── user/
│   │   ├── user-auth.ts
│   │   ├── user-profile.ts
│   │   └── ...
│   ├── component/
│   │   └── comp-*.ts
│   └── setting/
│       └── setting-*.ts
├── constant.ts      # Store keys
├── pinia.ts         # Pinia instance
└── types.d.ts       # Store type definitions
```

## Naming Convention

- **File name**: `{domain}-{feature}.ts`
- **Store function**: `useAppStore{Domain}{Feature}`
- **Store key**: `StoreKeys.{DOMAIN}_{FEATURE}`

| Domain | Prefix | Example |
|--------|--------|---------|
| App | `app-*` | `app-menu.ts`, `app-tab.ts` |
| User | `user-*` | `user-auth.ts`, `user-profile.ts` |
| Component | `comp-*` | `comp-capjs.ts` |
| Setting | `setting-*` | `setting-dev.ts` |

## Basic Store Template

```typescript
import type { YourType } from './types'
import { defineStore } from 'pinia'
import { StoreKeys } from '../../constant'
import { store } from '../../pinia'

// Inside store: use directly
const useYourStoreInside = defineStore(StoreKeys.YOUR_KEY, {
  state: (): YourType => ({
    data: null,
    loading: false,
  }),
  
  getters: {
    getData(state) {
      return state.data
    },
    isLoading(state) {
      return state.loading
    },
  },
  
  actions: {
    setData(payload: YourType['data']) {
      this.data = payload
    },
    
    async fetchData() {
      this.loading = true
      try {
        const res = await yourAPI()
        this.setData(res)
        return res
      }
      finally {
        this.loading = false
      }
    },
    
    $reset() {
      this.data = null
      this.loading = false
    },
  },
})

// Outside store: use this wrapper
const useYourStoreOutside = () => useYourStoreInside(store)

// Export: auto-detects if in component context
export function useAppStoreYourFeature() {
  if (getCurrentInstance())
    return useYourStoreInside()
  return useYourStoreOutside()
}
```

## Store with Persistence

### LocalStorage Persistence
```typescript
import { useAppStorage } from '@/utils/persistent/storage/sync'

const storage = useAppStorage(StoreKeys.YOUR_KEY, defaultValue)

const useYourStoreInside = defineStore(StoreKeys.YOUR_KEY, {
  state: () => ({
    data: storage,
  }),
})
```

### Encrypted Persistence
```typescript
import { enhancedAesGcmLocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'

const storage = await useAppStorageAsync(
  StoreKeys.YOUR_KEY, 
  defaultValue,
  { storage: enhancedAesGcmLocalStorage(true) }
)
```

### IndexedDB Persistence
```typescript
import { useAppStorageAsync } from '@/utils/persistent/storage/async'

const storage = await useAppStorageAsync(
  StoreKeys.YOUR_KEY,
  defaultValue,
  { storage: 'indexedDB' }
)
```

## Store Constants

Add new store key to `src/store/constant.ts`:

```typescript
export enum StoreKeys {
  // App
  APP_MENU = 'app-menu',
  APP_TAB = 'app-tab',
  
  // User
  USER_AUTH = 'user-auth',
  USER_PROFILE = 'user-profile',
  
  // Your new store
  YOUR_FEATURE = 'your-feature',
}
```

## Cross-Store Communication

### Calling Another Store
```typescript
actions: {
  async someAction() {
    // Get other stores
    const userStore = useAppStoreUserAuth()
    const menuStore = useAppStoreMenu()
    
    // Use their data/actions
    const token = userStore.getAccessToken
    await menuStore.fetchMenus()
  },
}
```

### Store Reset on Logout
```typescript
async Signout() {
  // Reset all related stores
  const userStoreProfile = useAppStoreUserProfile()
  const appStoreMenu = useAppStoreMenu()
  
  userStoreProfile.$reset()
  appStoreMenu.$reset()
}
```

## Reactive State Patterns

### Using Refs in State
```typescript
state: () => ({
  // Refs become reactive when accessed
  count: ref(0),
  items: ref<string[]>([]),
}),

actions: {
  increment() {
    this.count++
  },
}
```

### Computed in Getters
```typescript
getters: {
  doubleCount(state) {
    return computed(() => state.count * 2)
  },
  
  activeItems(state) {
    return computed(() => state.items.filter(i => i.active))
  },
}
```

## Best Practices

1. **Always use TypeScript** for state/getters/actions
2. **Prefix store keys** with domain (`app-`, `user-`, etc.)
3. **Use getters** for derived state, not duplicated logic
4. **Return promises** from async actions for chaining
5. **Implement `$reset`** for clean state restoration
6. **Use `getCurrentInstance()` check** for outside-component usage
7. **Separate sync/async storage** based on needs

## Common Store Patterns

### Loading State Pattern
```typescript
state: () => ({
  loading: false,
  data: null as DataType | null,
  error: null as Error | null,
}),

getters: {
  isEmpty(state) {
    return !state.loading && state.data === null
  },
},

actions: {
  async fetch() {
    this.loading = true
    this.error = null
    try {
      this.data = await api.fetch()
    }
    catch (e) {
      this.error = e as Error
    }
    finally {
      this.loading = false
    }
  },
}
```

### List State Pattern
```typescript
state: () => ({
  list: [] as ItemType[],
  selectedId: null as string | null,
}),

getters: {
  selectedItem(state) {
    return state.list.find(i => i.id === state.selectedId)
  },
  hasSelection(state) {
    return state.selectedId !== null
  },
},

actions: {
  select(id: string | null) {
    this.selectedId = id
  },
  
  remove(id: string) {
    const index = this.list.findIndex(i => i.id === id)
    if (index > -1) {
      this.list.splice(index, 1)
      if (this.selectedId === id) {
        this.selectedId = null
      }
    }
  },
}
```
