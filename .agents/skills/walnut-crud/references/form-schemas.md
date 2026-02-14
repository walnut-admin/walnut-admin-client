# Form Schema Types Reference

Complete reference for all WForm schema types.

## Base UI Components

### Base:Input
```typescript
{
  type: 'Base:Input',
  formProp: {
    path: 'fieldName',
    label: 'Label Text',
    rule: true, // or FormItemRule[]
  },
  componentProp: {
    clearable: true,
    placeholder: 'Enter...',
    onKeyupEnter: () => {},
  },
}
```

### Base:InputNumber
```typescript
{
  type: 'Base:InputNumber',
  formProp: { path: 'count' },
  componentProp: {
    min: 0,
    max: 100,
    defaultValue: 0,
  },
}
```

### Base:Select
```typescript
{
  type: 'Base:Select',
  formProp: { path: 'status' },
  componentProp: {
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    clearable: true,
  },
}
```

### Base:Radio
```typescript
{
  type: 'Base:Radio',
  formProp: { path: 'gender' },
  componentProp: {
    options: [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
    ],
  },
}
```

### Base:Checkbox
```typescript
{
  type: 'Base:Checkbox',
  formProp: { path: 'hobbies' },
  componentProp: {
    options: [
      { label: 'Reading', value: 'read' },
      { label: 'Sports', value: 'sport' },
    ],
  },
}
```

### Base:Switch
```typescript
{
  type: 'Base:Switch',
  formProp: { path: 'enabled' },
  componentProp: {
    defaultValue: true,
  },
}
```

### Base:DatePicker
```typescript
{
  type: 'Base:DatePicker',
  formProp: { path: 'birthDate' },
  componentProp: {
    type: 'date', // 'date' | 'datetime' | 'daterange'
    clearable: true,
  },
}
```

### Base:TimePicker
```typescript
{
  type: 'Base:TimePicker',
  formProp: { path: 'startTime' },
  componentProp: {
    format: 'HH:mm:ss',
  },
}
```

### Base:Tree
```typescript
{
  type: 'Base:Tree',
  formProp: { path: 'menus' },
  componentProp: {
    multiple: true,
    treeProps: {
      data: treeData,
      keyField: '_id',
      labelField: 'name',
    },
  },
}
```

### Base:TreeSelect
```typescript
{
  type: 'Base:TreeSelect',
  formProp: { path: 'category' },
  componentProp: {
    treeProps: {
      data: treeData,
    },
  },
}
```

### Base:DynamicTags
```typescript
{
  type: 'Base:DynamicTags',
  formProp: { path: 'tags' },
  componentProp: {
    defaultValue: [],
  },
}
```

### Base:ColorPicker
```typescript
{
  type: 'Base:ColorPicker',
  formProp: { path: 'themeColor' },
}
```

## Extra Components

### Extra:Password
```typescript
{
  type: 'Extra:Password',
  formProp: { path: 'password' },
  componentProp: {
    progress: true, // Show strength meter
    capslock: true, // Show capslock warning
  },
}
```

### Extra:VerifyCode
```typescript
{
  type: 'Extra:VerifyCode',
  formProp: { path: 'verifyCode' },
  componentProp: {
    target: 'email', // or 'phone'
    countDown: 60,
  },
}
```

### Extra:EmailInput
```typescript
{
  type: 'Extra:EmailInput',
  formProp: { path: 'email' },
  componentProp: {
    suffixList: ['@gmail.com', '@qq.com'],
  },
}
```

### Extra:PhoneNumberInput
```typescript
{
  type: 'Extra:PhoneNumberInput',
  formProp: { path: 'phone' },
}
```

### Extra:IconPicker
```typescript
{
  type: 'Extra:IconPicker',
  formProp: { path: 'icon' },
}
```

### Extra:LocaleSelect
```typescript
{
  type: 'Extra:LocaleSelect',
  formProp: { path: 'locale' },
}
```

### Extra:TransitionSelect
```typescript
{
  type: 'Extra:TransitionSelect',
  formProp: { path: 'transition' },
}
```

## Business Components

### Business:Dict
```typescript
{
  type: 'Business:Dict',
  formProp: { path: 'status' },
  componentProp: {
    dictType: 'sys_shared_status',
    renderType: 'radio', // 'select' | 'radio' | 'checkbox'
    componentProps: {
      button: true, // For radio button style
      valueType: 'boolean',
    },
  },
}
```

### Business:AreaCascader
```typescript
{
  type: 'Business:AreaCascader',
  formProp: { path: 'area' },
  componentProp: {
    depth: 3, // 1: province, 2: city, 3: district
  },
}
```

## Extend Components

### Extend:Query
```typescript
// Adds search and reset buttons to query form
{
  type: 'Extend:Query',
}
```

### Extend:Divider
```typescript
// Visual divider in form
{
  type: 'Extend:Divider',
  formProp: { label: 'Section Title' },
  componentProp: {
    titlePlacement: 'left',
  },
}
```

### Extend:RoleSelect
```typescript
{
  type: 'Extend:RoleSelect',
  formProp: { path: 'roles' },
  componentProp: {
    multiple: true,
  },
}
```

## Vendor Components

### Vendor:Tinymce
```typescript
{
  type: 'Vendor:Tinymce',
  formProp: { path: 'content' },
  componentProp: {
    height: 400,
  },
}
```

### Vendor:JSONEditor
```typescript
{
  type: 'Vendor:JSONEditor',
  formProp: { path: 'config' },
}
```

## Raw Components

### Raw:DynamicInput
```typescript
{
  type: 'Raw:DynamicInput',
  formProp: { path: 'items' },
  componentProp: {
    defaultValue: [],
  },
}
```

### Raw:Slider
```typescript
{
  type: 'Raw:Slider',
  formProp: { path: 'progress' },
  componentProp: {
    min: 0,
    max: 100,
  },
}
```

## Special Types

### Base:Render (Custom Render)
```typescript
{
  type: 'Base:Render',
  formProp: { path: 'custom' },
  componentProp: {
    render: ({ formData }) => h('div', 'Custom content'),
  },
}
```

### Base:Slot (Use Template Slot)
```typescript
{
  type: 'Base:Slot',
  formProp: { path: 'slotField' },
}
```

## Common Form Prop Options

```typescript
formProp: {
  path: 'fieldName',           // Required: model field path
  label: 'Label',              // Display label
  labelHelpMessage: 'Help',    // Help tooltip
  rule: true | [...],          // Validation rules
  ruleType: 'string',          // 'string' | 'number' | 'array' | etc
  locale: true,                // Enable localization
  localeWithTable: true,       // Use table locale keys
}
```

## Grid Layout Props

```typescript
{
  type: 'Base:Input',
  formProp: { path: 'name' },
  gridProp: {
    span: 12,      // 1-24 grid span
    offset: 0,     // Offset from left
    suffix: false, // Stick to right
  },
}
```

## Visibility Control

```typescript
{
  type: 'Base:Input',
  formProp: { path: 'conditional' },
  visibleProp: {
    vIf: (formData) => formData.type === 'special',
    vShow: true,
    visibleMode: 'auto-forward', // 'no-move' | 'auto-forward'
  },
}
```
