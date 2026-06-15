---
name: walnut-crud
description: Walnut Admin Client CRUD page development patterns. Use when creating or modifying CRUD pages (list, create, read, update, delete) in the walnut-admin-client project. This skill provides patterns for using WCRUD, WTable, WForm components with schema-driven configuration.
---

# Walnut Admin CRUD Development

This skill guides you through creating CRUD pages using Walnut Admin's schema-driven components.

## Core Concepts

### WCRUD Component
The `WCRUD` component combines `WTable` (for listing) and `WForm` (for create/update forms) into a complete CRUD solution.

### Schema-Driven Development
All form fields and table columns are defined via schemas (declarative configuration) rather than template markup.

## Quick Start

### Basic CRUD Page Structure

```vue
<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { yourAPI } from '@/api/module/your-api'

defineOptions({
  name: 'YourPage',
})

const key = 'yourEntity'
const keyField = '_id'

const [
  register,
  {
    onOpenCreateForm,
    onReadAndOpenUpdateForm,
    onDeleteConfirm,
    onDeleteManyConfirm,
    onApiList,
  },
] = useCRUD<IModels.YourModel>({
  baseAPI: yourAPI,
  strictFormData: true,
  safeForm: true,
  safeFormKey: key,
  
  tableProps: {
    localeUniqueKey: key,
    rowKey: row => row[keyField]!,
    
    // Query form above the table
    queryFormProps: {
      localeUniqueKey: key,
      span: 6,
      schemas: [
        {
          type: 'Base:Input',
          formProp: { path: 'name' },
          componentProp: { clearable: true, onKeyupEnter: () => onApiList() },
        },
        { type: 'Extend:Query' }, // Search + Reset buttons
      ],
    },
    
    // Table columns
    columns: [
      { key: 'index', extendType: 'index', fixed: 'left' },
      { key: 'name', width: 150 },
      { 
        key: 'action', 
        extendType: 'action', 
        fixed: 'right',
        columnBuiltInActions: [
          {
            _builtInType: 'read',
            async onPresetClick(rowData) {
              await onReadAndOpenUpdateForm(rowData[keyField]!)
            },
          },
          {
            _builtInType: 'delete',
            async onPresetClick(rowData) {
              await onDeleteConfirm(rowData[keyField]!)
            },
          },
        ],
      },
    ],
  },
  
  formProps: {
    localeUniqueKey: key,
    dialogPreset: 'drawer', // or 'modal'
    baseRules: true,
    schemas: [
      {
        type: 'Base:Input',
        formProp: { path: 'name' },
        componentProp: { clearable: true },
      },
    ],
  },
})
</script>

<template>
  <div>
    <WCRUD @hook="register" />
  </div>
</template>
```

## Schema Types Reference

See [references/form-schemas.md](references/form-schemas.md) for all form schema types.

See [references/table-columns.md](references/table-columns.md) for all table column types.

## useCRUD Hook Options

| Option | Type | Description |
|--------|------|-------------|
| `baseAPI` | `BaseAPIType<T>` | The API instance extending BaseAPI |
| `strictFormData` | `boolean` | Only send schema-defined fields to API |
| `safeForm` | `boolean` | Enable unsaved changes confirmation |
| `safeFormFeedback` | `boolean` | Show feedback in create form |
| `safeFormKey` | `string` | Unique key for form state storage |
| `safeFormUnwantedFields` | `Array<keyof T>` | Fields to ignore in change detection |
| `tableProps` | `WTable.Props<T>` | Table configuration |
| `formProps` | `WForm.Props<T>` | Form configuration |

## Common Patterns

### Adding Custom Actions

```typescript
headerLeftBuiltInActions: [
  {
    _builtInType: 'create',
    onPresetClick() { onOpenCreateForm() },
  },
  {
    _builtInType: 'delete',
    onPresetClick() { onDeleteManyConfirm() },
  },
]
```

### Permission Control

```typescript
auths: {
  list: 'module:entity:list',
  create: 'module:entity:create',
  read: 'module:entity:read',
  update: 'module:entity:update',
  delete: 'module:entity:delete',
}
```

### Conditional Action Buttons

```typescript
columnBuiltInActions: [
  {
    _builtInType: 'read',
    _show: row => row.status !== 'locked',
    async onPresetClick(rowData) {
      await onReadAndOpenUpdateForm(rowData._id!)
    },
  },
]
```

### Custom Form Handling

```typescript
const [register, { onGetActionType }] = useCRUD<IModels.Entity>({
  formProps: {
    dialogProps: {
      onYes: async (apiHandler, done) => {
        // Custom submit logic
        if (onGetActionType().value === 'create') {
          // Do something before create
        }
        // Call default handler
        await apiHandler()
        done()
      },
    },
  },
})
```

## API Requirements

Your API must extend `BaseAPI`:

```typescript
import { BaseAPI } from '@/api/base'
import type { IModels } from './models'

class EntityAPI extends BaseAPI<IModels.Entity> {
  constructor() {
    super({ model: 'module', section: 'entity' })
  }
  
  // Add custom methods if needed
  customMethod(data: any) {
    return AppAxios.post({ url: '/module/entity/custom', data })
  }
}

export const entityAPI = new EntityAPI()
```

## Localization

Use `localeUniqueKey` to auto-generate labels from i18n:

```typescript
// In form schema
{
  type: 'Base:Input',
  formProp: { path: 'userName' }, // Label: t('form.user.userName')
}

// In table columns
{ key: 'userName', width: 100 } // Title: t('table.user.userName')
```

Backend should provide translations at:
- `form.{key}.{field}` - Form labels
- `form.{key}.{field}.helpMsg` - Help messages
- `table.{key}.{field}` - Column titles
