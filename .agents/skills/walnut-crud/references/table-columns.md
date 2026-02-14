# Table Column Types Reference

Complete reference for all WTable column types.

## Base Column

```typescript
{
  key: 'fieldName',
  title: 'Column Title',
  width: 120,
  minWidth: 100,
  fixed: 'left', // 'left' | 'right'
  ellipsis: { tooltip: true },
  sorter: true,
}
```

## Extend Types

### Index Column
```typescript
{
  key: 'index',
  extendType: 'index',
  fixed: 'left',
  width: 60,
}
```

### Action Column
```typescript
{
  key: 'action',
  extendType: 'action',
  fixed: 'right',
  width: 150,
  columnBuiltInActions: [
    {
      _builtInType: 'read',
      onPresetClick: (rowData) => {},
    },
    {
      _builtInType: 'delete',
      _dropdown: true,
      onPresetClick: (rowData) => {},
    },
  ],
  columnExtraActions: [
    {
      _builtInType: 'custom',
      buttonProps: { textProp: 'Custom', type: 'primary' },
      iconProps: { icon: 'mdi:pencil' },
      onPresetClick: (rowData) => {},
    },
  ],
}
```

### Dictionary Column
```typescript
{
  key: 'status',
  extendType: 'dict',
  dictType: 'sys_shared_status',
  tagProps: (rowData) => ({ type: rowData.status ? 'success' : 'error' }),
}
```

### Tag Column
```typescript
{
  key: 'category',
  extendType: 'tag',
  tagProps: (rowData) => ({
    type: 'info',
    bordered: false,
  }),
}
```

### Link Column
```typescript
{
  key: 'email',
  extendType: 'link',
  onClick: (rowData) => openMailto(rowData.email),
}
```

### Icon Column
```typescript
{
  key: 'icon',
  extendType: 'icon',
  extendIconName: 'mdi:account',
}
```

## Preset Columns

Use preset columns for consistent date/status displays:

```typescript
import { 
  WTablePresetStatusColumn,
  WTablePresetOrderColumn, 
  WTablePresetCreatedAtColumn,
  WTablePresetUpdatedAtColumn 
} from '@/components/UI/Table/src/utils/presetColumns'

// In columns array:
{
  ...WTablePresetStatusColumn,
  sorter: { multiple: 3, compare: 'default' },
},
{
  ...WTablePresetCreatedAtColumn,
  sorter: { multiple: 2, compare: 'default' },
},
{
  ...WTablePresetUpdatedAtColumn,
  defaultSortOrder: 'descend',
  sorter: { multiple: 1, compare: 'default' },
},
```

## Action Button Props

```typescript
{
  _builtInType: 'read' | 'delete' | 'create' | 'detail',
  _show: (rowData) => boolean,
  _disabled: (rowData) => boolean,
  _dropdown: boolean,
  buttonProps: {
    textProp: string | (() => string),
    type: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default',
    size: 'tiny' | 'small' | 'medium' | 'large',
    auth: 'permission:string',
  },
  iconProps: {
    icon: 'mdi:icon-name',
    size: 16,
  },
  onPresetClick: (rowData, rowIndex) => void | Promise<void>,
}
```

## Column Formatters

```typescript
{
  key: 'amount',
  formatter: (rowData, rowIndex) => {
    return `¥${rowData.amount.toFixed(2)}`
  },
}
```

## Table Props Reference

```typescript
{
  localeUniqueKey: 'entity',
  rowKey: (row) => row._id,
  
  // Styling
  striped: true,
  bordered: true,
  singleLine: false,
  
  // Pagination
  pagination: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    showSizePicker: true,
  },
  
  // API integration
  apiProps: {
    listApi: (params) => api.list(params),
    deleteApi: (id) => api.delete(id),
    deleteManyApi: (ids) => api.deleteMany(ids),
  },
  
  // Permissions
  auths: {
    list: 'module:entity:list',
    create: 'module:entity:create',
    delete: 'module:entity:delete',
    deleteMany: 'module:entity:deleteMany',
  },
  
  // Polling
  polling: 5000, // Auto refresh every 5s
  
  // Column settings
  columnSetting: true,
}
```
