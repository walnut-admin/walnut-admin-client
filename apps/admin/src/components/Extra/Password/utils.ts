import type { ProgressStatus } from 'naive-ui'

/**
 * @description check string strength
 */
export function checkStrStrong(str: string) {
  if (!str)
    return 0

  if (str.length <= 6)
    return 1

  let modes = 1
  if (/\d/.test(str))
    modes++ // number
  if (/[a-z]/.test(str))
    modes++ // lower
  if (/[A-Z]/.test(str))
    modes++ // upper
  if (/\W/.test(str))
    modes++ // special
  switch (modes) {
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
    case 5:
      return str.length < 12 ? 4 : 5
    /* istanbul ignore next */
    default:
      return 1
  }
}

export const statusTable: Record<number, ProgressStatus> = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'info',
  4: 'success',
} as const
