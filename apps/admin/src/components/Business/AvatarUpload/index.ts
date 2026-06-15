export { default } from './index.vue'

export interface WAvatarUploadInst {
  onOSSUpload: () => Promise<boolean>
}
