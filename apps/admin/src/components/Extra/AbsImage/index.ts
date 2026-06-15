export { default } from './index.vue'

export interface WCompExtraAbsImageInst {
  onGetBlobURL: () => Promise<string>
  onGetBase64: () => Promise<string>
  onGetBlob: () => Blob
}
