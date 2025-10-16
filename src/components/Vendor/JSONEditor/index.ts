import type JsonEditorVue from 'json-editor-vue'
import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

type JsonEditorProps = InstanceType<typeof JsonEditorVue>['$props']

// TODO 000
export interface ICompVendorJSONEditorProps extends /* @vue-ignore */ JsonEditorProps {
  button?: boolean
  modalTitle?: string
}
