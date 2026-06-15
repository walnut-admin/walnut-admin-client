import type { OptionDataItem, Recordable } from 'easy-fns-ts'
import { getBoolean } from '@/utils/shared'

/**
 * @link https://stackoverflow.com/questions/47062922/how-to-get-all-keys-with-values-from-nested-objects
 */
export function deepKeys(t: Recordable, pre: any[] = []): string[] {
  if (Array.isArray(t)) {
    return []
  }
  else if (Object(t) === t) {
    return Object.entries(t).flatMap(([k, v]) => deepKeys(v, [...pre, k]))
  }
  else {
    return [pre.join('.')]
  }
}

/**
/**
 * @description Generate view options arr through vite feature `globEager`
 * see more https://vitejs.dev/guide/features.html#glob-import
 */
export function getViewsOptions() {
  const views: { [k: string]: { name: string, defaultView: boolean } } = import.meta.glob('@/views/**/*.vue', {
    eager: true,
    import: 'default',
  })

  const viewOptions: OptionDataItem<{ name?: string }>[] = []

  Object.entries(views).forEach(([key, value]) => {
    const field = key.replace('/src/views/', '').replace('.vue', '')

    // This is custom prop for filter vue files
    // If don't want vue file to be seen in `viewOptions`, set `defaultView` to false
    // For example, we set `defaultView` false in `404/500/auth` pages, so these pages won't be able to config in `system/menu` page
    if (getBoolean(value.defaultView)) {
      viewOptions.push({
        value: field,
        label: `@/views/${field}.vue`,
        name: value.name,
      })
    }
  })

  const nameOptions = viewOptions.map(i => ({
    value: i.name,
    label: i.name,
  }))

  return { viewOptions, nameOptions }
}

export const menuTypeOptions: OptionDataItem[] = [
  {
    value: AppConstMenuType.CATALOG,
    label: 'Catalog',
  },
  {
    value: AppConstMenuType.MENU,
    label: 'Menu',
  },
  {
    value: AppConstMenuType.ELEMENT,
    label: 'Element',
  },
]

export const menuTernalOptions: OptionDataItem[] = [
  {
    value: AppConstMenuTernal.NONE,
    label: 'Normal',
  },
  {
    value: AppConstMenuTernal.EXTERNAL,
    label: 'External',
  },
  {
    value: AppConstMenuTernal.INTERNAL,
    label: 'Internal',
  },
]

export const cacheKeyStrategyOptions: OptionDataItem[] = [
  {
    value: AppConstCacheKeyStrategy.NAME,
    label: 'Name',
  },
  {
    value: AppConstCacheKeyStrategy.PATH,
    label: 'Path',
  },
  {
    value: AppConstCacheKeyStrategy.CUSTOM,
    label: 'Custom',
  },
]
