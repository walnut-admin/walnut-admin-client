import type { Options } from 'signature_pad'

export interface ICompVendorSignPadProps {
  options?: Partial<Options>
  height?: string
  width?: string
  disabled?: boolean
  defaultUrl?: string
  content?: string
  colors?: string[]
}

export interface ICompVendorSignPadInst {
  save: (format?: string) => string
  clear: () => void
  isEmpty: () => boolean
  undo: () => void
  fromDataURL: (url: string) => void
  getImage: (type?: string) => Promise<string>
}
