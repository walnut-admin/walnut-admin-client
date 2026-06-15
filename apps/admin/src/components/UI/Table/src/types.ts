import type { NullableRecord, Recordable, StringOrNumber } from 'easy-fns-ts'

import type { DataTableBaseColumn, DataTableColumn, DataTableCreateRowKey, DataTableCreateSummary, DataTableExpandColumn, DataTableFilterState, DataTableInst, DataTableSelectionColumn, DataTableSortState, PaginationProps, PopoverProps, ScrollbarProps, TagProps } from 'naive-ui'
import type { HTMLAttributes, VNodeChild } from 'vue'
import type { ICompUIButtonProps } from '../../Button'
import type { WForm } from '../../Form'
import type { ICompUIIconButtonProps } from '../../IconButton'
import type { ICompUITableHooksMethods } from './hooks/useTableMethods'
import type { IHooksUseProps } from '@/hooks/core/useProps'
import type { IAxios } from '@/utils/axios/types'

export declare namespace WTable {
  type ColumnActionType = 'create' | 'read' | 'delete' | 'detail'

  type HeaderLeftBulitInActionType = 'create' | 'update' | 'delete' | 'export' | 'import'

  type FinishLoadingCallback = WForm.onFinishFormLoadingCallback

  interface Auths {
    list?: string
    create?: string
    read?: string
    update?: string
    delete?: string
    deleteMany?: string
    import?: string
    export?: string
  }

  /**
   * @description callback function
   */
  type TableFnCallback<T, R = void> = (rowData: T, rowIndex?: number) => Promise<T> | Promise<R> | R | any

  /**
   * @description set table props
   */
  type SetTableProps<T> = IHooksUseProps<Props<T>>['setProps']

  /**
   * @description Inst
   */
  namespace Inst {
    type NDataTableInst = DataTableInst

    interface ExtendInst<T> {
      setProps: SetTableProps<T>

      /**
       * @description API table default init function
       */
      onApiList: () => Promise<void>

      /**
       * @description API table default delete function
       */
      onApiDelete: (id: StringOrNumber) => Promise<T>

      /**
       * @description API table default delete many function
       */
      onApiDeleteMany: () => Promise<T[] | undefined>

      /**
       * @description get list params
       */
      onGetApiListParams: () => Ref<IAxios.BaseListParams<T>>

      /**
       * @description set default query form data
       */
      onSetDefaultQueryFormData: (newQueryFormData: NullableRecord<T>) => void
    }

    interface WTableInst<T> extends Partial<NDataTableInst>, ExtendInst<T> { }
  }

  /**
   * @description Hooks
   */
  namespace Hooks {
    namespace UseTable {
      type Props<T> = WTable.Props<T> | ComputedRef<WTable.Props<T>> | IDeepMaybeRef<WTable.Props<T>>

      type Methods<T> = ICompUITableHooksMethods & Omit<Inst.WTableInst<T>, 'setProps'>

      type ReturnType<T> = [
        (instance: Inst.WTableInst<T>) => void,
        Methods<T>,
      ]
    }

  }

  /**
   * @description Props
   */
  interface Props<T = Recordable> {
    // original
    allowCheckingNotLoaded?: boolean
    bordered?: boolean
    bottomBordered?: boolean
    checkedRowKeys?: StringOrNumber[]
    cascade?: boolean
    childrenKey?: string
    defaultCheckedRowKeys?: StringOrNumber[]
    defaultExpandedRowKeys?: StringOrNumber[]
    defaultExpandAll?: boolean
    expandedRowKeys?: StringOrNumber[]
    filterIconPopoverProps?: PopoverProps
    flexHeight?: boolean
    getCsvCell?: (value: any, row: object, col: DataTableBaseColumn) => string
    getCsvHeader?: (cols: Array<DataTableColumn>) => string
    headerHeight?: number
    heightForRow?: (rowData: object, index: number) => number
    indent?: number
    loading?: boolean
    maxHeight?: StringOrNumber
    minHeight?: StringOrNumber
    minRowHeight?: number
    paginateSinglePage?: boolean
    pagination?: boolean | PaginationProps
    paginationBehaviorOnFilter?: 'first' | 'current'
    remote?: boolean
    renderCell?: (value: any, rowData: object, column: DataTableBaseColumn) => VNodeChild
    renderExpandIcon?: ({ expanded, rowData }: { expanded: boolean, rowData: object }) => VNodeChild
    rowClassName?: string | ((rowData: object, index: number) => string)
    rowProps?: (rowData: object, rowIndex: number) => HTMLAttributes
    scrollX?: StringOrNumber
    scorllbarProps?: ScrollbarProps
    singleColumn?: boolean
    singleLine?: boolean
    size?: 'small' | 'medium' | 'large'
    spinProps?: { strokeWidth?: number, stroke?: string }
    stickyExpandedRows?: boolean
    striped?: boolean
    summary?: DataTableCreateSummary
    summaryPlacement?: 'top' | 'bottom'
    tableLayout?: 'auto' | 'fixed'
    virtualScroll?: boolean
    virtualScrollHeader?: boolean
    virtualScrollX?: boolean
    onUpdateCheckedRowKeys?: (keys: Array<string | number>) => void
    onUpdateSorter?: (options: DataTableSortState | DataTableSortState[] | null) => void
    onUpdateFilters?: (filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) => void

    /**
     * @override
     * @description for generic
     */
    data?: T[]

    /**
     * @override
     * @description Rewrite NDataTable columns type, add our own custom column type
     * And better generic support
     */
    columns?: Column<T>[]

    /**
     * @override
     * @description for generic
     */
    rowKey?: DataTableCreateRowKey<T>

    /**
     * @extends
     * @description locale unique key, for this table fields
     * @example 'locale' / 'lang'
     */
    localeUniqueKey?: string

    /**
     * @extends
     * @description api table auth controll
     */
    auths?: Auths

    /**
     * @extends
     * @description api relative props
     */
    apiProps?: {
      /**
       * @description before request hook, you can change the request params here or do some request
       * @retrurn IAxios.BaseListParams<T>
       */
      onBeforeRequest?: (params: T) => Promise<T>

      /**
       * @description list api, need to follow response structure
       * @retrurn IAxios.BaseListResponse<T>
       */
      listApi?: (params: IAxios.BaseListParams<T>) => Promise<IAxios.BaseListResponse<T>>

      /**
       * @description delete api, need to follow response structure
       * @retrurn T
       */
      deleteApi?: (id: StringOrNumber) => Promise<T>

      /**
       * @description delete many api, need to follow response structure
       * @retrurn T[]
       */
      deleteManyApi?: (ids: string) => Promise<T[]>
    }

    /**
     * @extends
     * @description query form props
     */
    queryFormProps?: WForm.Props<T>

    /**
     * @extends
     * @description header left built in actions
     */
    headerLeftBuiltInActions?: {
      _builtInType?: WTable.HeaderLeftBulitInActionType

      /**
       * @description click event, do not use buttonProps.onClick
       */
      onPresetClick?: () => void
    }[]

    /**
     * @extends
     * @description header left extra actions
     */
    headerLeftExtraActions?: ICompUIButtonProps[]

    /**
     * @extends
     * @description polling milliseconds
     */
    polling?: number

    /**
     * @extends
     * @description column setting, show column setting
     * @default true
     */
    columnSetting?: boolean
  }

  /**
   * @description Table context
   */
  interface Context<T> {
    tableRef: Ref<Inst.NDataTableInst | null>
    tableColumns: Ref<Column<T>[]>
    tableEvent: ShortEmits<Emits<T>>
    tablePropsCtx: IHooksUseProps<Props<T>>

    apiListParams: Ref<IAxios.BaseListParams<T>>
    onApiList: () => Promise<void>
    onApiQuery: WForm.onFinishFormLoadingCallback
    onApiReset: WForm.onFinishFormLoadingCallback

    checkedRowKeys: Ref<StringOrNumber[]>
  }

  /**
   * @description Table Emits
   */
  interface Emits<T> {
    hook: [inst: Inst.WTableInst<T>]
  }

  /**
   * @description Table Column
   */
  type Column<T>
    = | (ExtendType.Action<T>
      | ExtendType.Icon<T>
      | ExtendType.Link<T>
      | ExtendType.Dictionary<T>
      | ExtendType.Tag<T>
      | ExtendType.Index<T>)
    & (Partial<Omit<DataTableSelectionColumn<T>, 'sorter' | 'filter' | 'filterOptions'>>
      | Partial<Omit<DataTableExpandColumn<T>, 'sorter' | 'filter' | 'filterOptions'>>)

  namespace ExtendType {
    /**
     * @description action button basic extend prop
     */
    interface ActionButtonsBasic<T> {
      /**
       * @description custom show callback for action button
       */
      _disabled?: TableFnCallback<T, boolean> | boolean

      /**
       * @description custom show callback for action button
       */
      _show?: TableFnCallback<T, boolean> | boolean

      /**
       * @description button show in dropdown or outside
       */
      _dropdown?: boolean
    }

    /**
     * @description action column buttons type
     */
    interface ActionButtons<T> extends ActionButtonsBasic<T>, ICompUIIconButtonProps {
      /**
       * @description builtIn button, support {ColumnActionType}
       */
      _builtInType: ColumnActionType | string

      /**
       * @description click event, do not use buttonProps.onClick
       */
      onPresetClick?: TableFnCallback<T>
    }

    /**
     * @description base extend table column type
     */
    type BaseExtend<T, E> = Omit<DataTableBaseColumn<T>, 'type'> & {
      /**
       * @description extend type string
       */
      extendType?: E

      /**
       * @description column help message
       */
      titleHelpMessage?: string | boolean

      /**
       * @description Used for localed table column which do not need to locale with the whole table
       * TRUE when localeUniqueKey has value, specify FALSE when no need to locale the title or titleHelpMessage.
       */
      locale?: boolean

      /**
       * @description basic formatter
       */
      formatter?: TableFnCallback<T, string>

      /**
       * @description raw title
       */
      _rawTitle?: string

      /**
       * @description internal show flag
       */
      _internalShow?: boolean
    }

    /**
     * @description preset index column, default is used for api table with pageNum and pageSize
     */
    type Index<T = Recordable> = BaseExtend<T, 'index'>

    /**
     * @description preset icon column, use `WIcon`by default
     */
    type Icon<T = Recordable> = BaseExtend<T, 'icon'> & {
      extendIconName: string
    }

    /**
     * @description preset link column, used for a link redirect
     */
    type Link<T = Recordable> = BaseExtend<T, 'link'> & {
      onClick?: TableFnCallback<T, any>
    }

    /**
     * @description preset dictionay column, must provide `dictType`
     * Also support a tag display, pass `tagProps` to show `n-tag` properly
     */
    type Dictionary<T = Recordable> = BaseExtend<T, 'dict'> & {
      dictType: string
      tagProps?: TableFnCallback<T, TagProps>

      // set this true means use `dict.name` as table column label
      useDictNameAsTitle?: boolean
    }

    /**
     * @description normal tag render, provide a tagProps to config
     */
    type Tag<T = Recordable> = BaseExtend<T, 'tag'> & {
      tagProps?: TableFnCallback<T, TagProps>
    }

    /**
     * @description preset acion column, default includes three buttons: read / delete
     */
    type Action<T = Recordable> = BaseExtend<T, 'action'> & {

      /**
       * @description built in action buttons
       */
      columnBuiltInActions: ActionButtons<T>[]

      /**
       * @description extra action buttons
       */
      columnExtraActions?: ActionButtons<T>[]
    }
  }
}
