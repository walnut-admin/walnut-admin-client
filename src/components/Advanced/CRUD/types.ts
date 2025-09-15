import type { NullableRecord, StringOrNumber } from 'easy-fns-ts'
import type { BaseAPIType } from '@/api/base'
import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'
import type { WTable } from '@/components/UI/Table'
import type { IAxios } from '@/utils/axios/types'

export declare namespace WCrud {
  type SetProps<T extends IModels.Base> = (p: Partial<Props<T>>) => void

  /**
   * @description Props
   */
  interface Props<T extends IModels.Base> {
    baseAPI?: BaseAPIType<T>
    onBeforeRequest?: (data: T) => T
    tableProps?: Omit<WTable.Props<T>, 'apiProps'>
    formProps?: Partial<WForm.Props<T>>

    /**
     * @default false
     * @description strict create/update form data based on schema item
     * some fields from read endpoint is useless in update endpoint, will cause params error
     * set true to pick fields that are declared in form schema, also concat with _id by default
     */
    strictFormData?: boolean

    /**
     * @default true
     * @description show close confirm in dialog form when form is modified
     */
    safeForm?: boolean

    /**
     * @default true
     * @description feedback form in create form action type
     */
    safeFormFeedback?: boolean

    /**
     * @description safe form map key, need to be unique
     */
    safeFormKey?: string

    /**
     * @description fields that do not want to listen change
     */
    safeFormUnwantedFields?: (keyof T)[]
  }

  /**
   * @description Emits
   */
  interface Emits<T extends IModels.Base> {
    hook: [inst: Inst.WCrudInst<T>]
  }

  /**
   * @description Inst
   */
  namespace Inst {
    interface WCrudInst<T extends IModels.Base> {
      setProps: SetProps<T>
      onOpenCreateForm: (generateDefaultFormData?: boolean) => void
      onReadAndOpenUpdateForm: (id: StringOrNumber) => Promise<void>
      onDeleteConfirm: (id: StringOrNumber) => Promise<T>
      onDeleteManyConfirm: () => Promise<T[] | undefined>
      onGetFormData: () => Ref<T>
      onGetActionType: () => Ref<IActionType>
      onApiList: () => Promise<void>
      onGetApiListParams: () => Ref<IAxios.BaseListParams<T>>
      onSetDefaultQueryFormData: (newQueryFormData: NullableRecord<T>) => void
    }
  }

  /**
   * @description Hooks
   */
  namespace Hooks {
    namespace UseCRUD {
      type Props<T extends IModels.Base> = WCrud.Props<T> | ComputedRef<WCrud.Props<T>> | IDeepMaybeRef<WCrud.Props<T>>

      type Methods<T extends IModels.Base> = Omit<Inst.WCrudInst<T>, 'setProps'>

      type ReturnType<T extends IModels.Base> = [
        (instance: Inst.WCrudInst<T>) => void,
        Methods<T>,
      ]
    }
  }
}
