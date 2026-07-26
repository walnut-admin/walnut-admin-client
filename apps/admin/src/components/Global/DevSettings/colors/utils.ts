import { adjustColor } from 'easy-fns-ts'

/**
 * @description according to input color, generate 9 colors, 4 lighter, 4 darker
 * Second params stand for how far want to change each round
 */
export function getThemeColors(color: string, step = 5): string[] {
  return Array.from({ length: 4 }, (_, index: number) =>
    adjustColor(color, +((index + 1) * step)))
    .reverse()
    .concat([color])
    .concat(
      Array.from({ length: 4 }, (_, index: number) =>
        adjustColor(color, -((index + 1) * step))),
    )
}
