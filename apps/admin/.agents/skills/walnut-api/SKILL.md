---
name: walnut-api
description: Walnut Admin Client API layer development patterns. Use when creating or modifying API modules in the walnut-admin-client project. Provides patterns for BaseAPI extension, axios adapters, interceptors, and request/response types.
---

# Walnut Admin API Development

This skill guides you through creating API layers following Walnut Admin's patterns.

## API Layer Structure

```
api/
├── base.ts           # BaseAPI class with CRUD operations
├── models.d.ts       # API model type definitions
├── request.d.ts      # Request payload types
├── response.d.ts     # Response types
├── index.ts          # API exports
├── auth/             # Auth-related APIs
├── system/           # System management APIs
├── app/              # Application APIs
├── security/         # Security APIs
└── shared/           # Shared/common APIs
```

## BaseAPI Pattern

All APIs extend `BaseAPI<T>` for standard CRUD operations:

```typescript
import { BaseAPI } from '@/api/base'
import type { IModels } from './models'

class EntityAPI extends BaseAPI<IModels.Entity> {
  constructor() {
    super({ 
      model: 'module',     // API module path
      section: 'entity'    // API section path
    })
  }
  
  // BaseAPI provides:
  // - list(data?)   -> POST /module/entity/list
  // - create(data)  -> POST /module/entity
  // - read(id)      -> GET /module/entity/:id
  // - update(data)  -> PUT /module/entity/:id
  // - delete(id)    -> DELETE /module/entity/:id
  // - deleteMany(ids) -> DELETE /module/entity/deleteMany/:ids
  // - clear()       -> DELETE /module/entity/clear
  
  // Add custom methods
  customAction(data: any) {
    return AppAxios.post({
      url: '/module/entity/custom-action',
      data,
    })
  }
  
  // Upload with multipart/form-data
  upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return AppAxios.post({
      url: '/module/entity/upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}

export const entityAPI = new EntityAPI()
```

## Model Types

Define models in `api/models.d.ts`:

```typescript
export declare namespace IModels {
  interface Base {
    _id?: string
    createdAt?: string
    updatedAt?: string
  }
  
  interface Entity extends Base {
    name: string
    description?: string
    status: boolean
  }
}
```

## Request Types

Define request payloads in `api/request.d.ts`:

```typescript
export declare namespace IRequestPayload {
  namespace Entity {
    interface Create {
      name: string
      description?: string
    }
    
    interface Update extends Create {
      _id: string
    }
    
    interface Query {
      name?: string
      status?: boolean
    }
  }
}
```

## Response Types

Define responses in `api/response.d.ts`:

```typescript
export declare namespace IResponse {
  namespace Entity {
    interface Detail {
      _id: string
      name: string
      // ...
    }
    
    type List = Detail[]
  }
}
```

## API Usage in Components

```typescript
import { entityAPI } from '@/api/module/entity'

// In async function
async function fetchData() {
  // List with pagination
  const { list, pagination } = await entityAPI.list({
    page: 1,
    pageSize: 10,
    // ...filters
  })
  
  // Get single item
  const item = await entityAPI.read('id')
  
  // Create
  await entityAPI.create({ name: 'New Item' })
  
  // Update
  await entityAPI.update({ _id: 'id', name: 'Updated' })
  
  // Delete
  await entityAPI.delete('id')
}
```

## Axios Configuration

### Basic Request
```typescript
import { AppAxios } from '@/utils/axios'

// GET
const data = await AppAxios.get({
  url: '/endpoint',
  params: { key: 'value' },
})

// POST
const result = await AppAxios.post({
  url: '/endpoint',
  data: { key: 'value' },
})

// PUT
await AppAxios.put({
  url: '/endpoint',
  data: { key: 'value' },
})

// DELETE
await AppAxios.delete({
  url: '/endpoint',
})
```

### Request with Options
```typescript
await AppAxios.post({
  url: '/endpoint',
  data: payload,
  
  // Skip auth header
  auth: false,
  
  // Custom timeout
  timeout: 10000,
  
  // Skip error handling
  error: false,
  
  // Skip loading indicator
  loading: false,
  
  // Cache response
  cache: true,
  
  // Retry on failure
  retry: 3,
  
  // Throttle requests
  throttle: 1000,
  
  // Cancel duplicate requests
  cancel: true,
})
```

## Interceptors

Available request/response interceptors in `src/utils/axios/interceptors/`:

### Request Interceptors
- **catch** - Error handling
- **crypto** - Request encryption

### Response Interceptors
- **catch** - Error handling
- **crypto** - Response decryption
- **capJSToken** - CAPTCHA token handling
- **refreshToken** - Auto token refresh
- **rsaDecrypt** - RSA decryption
- **sign** - Response signature verification

## Adapter Stack

Axios adapters (in order) in `src/utils/axios/adapters/`:

1. **idAdapter** - Add request ID
2. **cancelAdapter** - Cancel duplicate requests
3. **cacheAdapter** - Cache responses
4. **throttleAdapter** - Throttle requests
5. **retryAdapter** - Retry failed requests
6. **mergeAdapter** - Merge concurrent requests

## File Download

```typescript
import { downloadBlob } from '@/utils/file/download'

async function downloadFile() {
  const blob = await AppAxios.post({
    url: '/api/export',
    data: filters,
    responseType: 'blob',
  })
  
  downloadBlob(blob, 'filename.xlsx')
}
```

## Best Practices

1. **Always extend BaseAPI** for CRUD resources
2. **Export API instances** as singletons
3. **Use TypeScript** for all request/response types
4. **Keep API functions pure** - no UI logic
5. **Name API functions with API suffix**:
   ```typescript
   export const fetchUserAPI = () => {}
   export const updateSettingAPI = () => {}
   ```
6. **Handle errors at component level**, not in API layer
7. **Use AppAxios options** for loading states, caching, etc.

## Quick Reference

| Operation | Method | URL Pattern |
|-----------|--------|-------------|
| List | POST | `/{model}/{section}/list` |
| Create | POST | `/{model}/{section}` |
| Read | GET | `/{model}/{section}/{id}` |
| Update | PUT | `/{model}/{section}/{id}` |
| Delete | DELETE | `/{model}/{section}/{id}` |
| Delete Many | DELETE | `/{model}/{section}/deleteMany/{ids}` |
| Clear | DELETE | `/{model}/{section}/clear` |
