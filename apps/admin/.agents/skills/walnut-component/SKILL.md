---
name: walnut-component
description: Walnut Admin Client component development patterns. Use when creating or modifying Vue components in the walnut-admin-client project. Provides the standard component structure with index.ts + index.vue pattern, composable hooks pattern, and context injection pattern.
---

# Walnut Admin Component Development

This skill guides you through creating components following Walnut Admin's established patterns.

## Component Structure

Every component follows this folder structure:

```
ComponentName/
├── index.ts      # Public exports
└── index.vue     # Component implementation
```

## Basic Component Template

### index.ts
```typescript
import type { App } from 'vue'
import Component from './index.vue'

export * from './types' // if exists
export { Component as YourComponent }

export default {
  install(app: App) {
    app.component('WYourComponent', Component)
  },
}
```

### index.vue
```vue
<script lang="ts" setup>
import type { YourProps } from './types'

defineOptions({
  name: 'WCompYourComponent', // Naming convention: WComp{Category}{Name}
})

const props = withDefaults(defineProps<YourProps>(), {
  // defaults
})

const emit = defineEmits<{
  change: [value: string]
}>()

// Component logic
</script>

<template>
  <div class="w-your-component">
    <!-- Template -->
  </div>
</template>

<style scoped>
.w-your-component {
  /* Styles */
}
</style>
```

## Component Categories

Components are organized by category in `src/components/`:

| Category | Path | Description |
|----------|------|-------------|
| Advanced | `Advanced/` | High-level composite components (CRUD, ApiSelect) |
| App | `App/` | App-level components (Lock, Search, Settings) |
| Business | `Business/` | Business logic components (Dict, AreaCascader) |
| Extra | `Extra/` | Extra utilities (Copy, QRCode, Password) |
| Global | `Global/` | Global components (Cap, DevSettings) |
| HOC | `HOC/` | Higher-order components |
| UI | `UI/` | UI wrapper components (Form, Table, Modal) |
| Vendor | `Vendor/` | Third-party wrappers (CodeMirror, ECharts, Tinymce) |

## Component Naming Convention

- **Folder**: PascalCase matching component name
- **Component name**: `WComp{Category}{Name}`
  - `WCompUIForm`
  - `WCompAppLock`
  - `WCompExtraPassword`

## The "Register + Methods" Pattern

Many components use this pattern for parent-child communication:

### Component Side (Child)
```vue
<script lang="ts" setup>
const props = defineProps<...>()
const emit = defineEmits<{
  hook: [inst: YourInst]
}>()

// Methods to expose
const methods = {
  validate: async () => { /* ... */ },
  reset: () => { /* ... */ },
  setProps: (newProps) => { /* ... */ },
}

// Expose for template ref access
defineExpose(methods)

// Emit hook for useXxx pattern
emit('hook', {
  ...methods,
  // add setProps if using useProps
})
</script>
```

### Parent Side (Consumer)
```vue
<script lang="ts" setup>
// Pattern: [register, methods] = useXxx(props)
const [register, { validate, reset }] = useForm({
  // initial props
})
</script>

<template>
  <WForm @hook="register" />
</template>
```

## Context Injection Pattern

For passing data through deep component trees:

### Create Context
```typescript
// hooks/useContext.ts
import type { InjectionKey } from 'vue'

export interface Context {
  formRef: Ref<FormInst | null>
  formSchemas: Ref<Schema[]>
  // ...
}

const key: InjectionKey<Context> = Symbol('WFormContext')

export function setFormContext(ctx: Context) {
  provide(key, ctx)
}

export function useFormContext() {
  return inject(key)!
}
```

### Use Context
```vue
<script lang="ts" setup>
// Parent component
import { setFormContext } from './hooks/useContext'

setFormContext({
  formRef,
  formSchemas,
  // ...
})
</script>
```

```vue
<script lang="ts" setup>
// Child component
import { useFormContext } from './hooks/useContext'

const { formRef, formSchemas } = useFormContext()
</script>
```

## useProps Pattern

For dynamic prop updates:

```typescript
import { useProps } from '@/hooks/core/useProps'

const props = defineProps<...>()

const propsCtx = useProps(props)
const { setProps, getProps } = propsCtx

// In template, use getProps
const getComputedProp = computed(() => getProps.value.someProp)

// Parent can update props dynamically
setProps({ someProp: 'new value' })
```

## Async Component Pattern

For code-splitting heavy components:

```typescript
import { createAsyncComponent } from '@/utils/factory/asyncComponent'

const HeavyComponent = createAsyncComponent(() => import('./HeavyComponent'))
```

## Component Types Pattern

### types.ts
```typescript
export interface ICompUIYourComponentProps {
  modelValue?: string
  disabled?: boolean
}

export interface ICompUIYourComponentInst {
  focus: () => void
  blur: () => void
}
```

## Slots Pattern

```vue
<template>
  <div>
    <!-- Default slot -->
    <slot />
    
    <!-- Named slot -->
    <slot name="header" :header-data="headerData" />
    
    <!-- Scoped slot with fallback -->
    <slot name="item" :item="item" :index="index">
      <span>{{ item.label }}</span>
    </slot>
  </div>
</template>
```

## Styling Guidelines

1. **Use UnoCSS** for utility classes:
   ```vue
   <template>
     <div class="flex items-center gap-2 p-4">
   ```

2. **Scoped styles** for component-specific CSS:
   ```vue
   <style scoped>
   .custom-element {
     @apply text-primary;
   }
   </style>
   ```

3. **CSS variables** for theming:
   ```vue
   <style scoped>
   .component {
     color: var(--primary-color);
   }
   </style>
   ```

## Auto-Import Considerations

This project uses `unplugin-auto-import`. Common imports are automatic:
- Vue: `ref`, `reactive`, `computed`, `watch`, etc.
- Vue Router: `useRoute`, `useRouter`
- Vue I18n: `useI18n`
- Pinia: `defineStore`, `storeToRefs`
- VueUse: Most functions

Explicit imports preferred for:
- Component types
- Utils from `@/utils/*`
- Hooks from `@/hooks/*`

## Best Practices

1. **Always use `defineOptions`** for component name
2. **Use TypeScript generics** when component handles data types:
   ```vue
   <script lang="ts" setup generic="T extends IModels.Base">
   ```
3. **Expose methods via `defineExpose`** for template ref access
4. **Emit 'hook' event** for register pattern compatibility
5. **Use `shallowRef`** for component template refs
