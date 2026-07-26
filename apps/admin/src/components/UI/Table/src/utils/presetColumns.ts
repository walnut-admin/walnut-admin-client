import type { WTable } from '../types'

export const WTablePresetOrderColumn: Pick<WTable.Column<any>, 'key' | 'width'> = {
  key: 'order',
  width: 100,
}

export const WTablePresetStatusColumn: Pick<WTable.ExtendType.Dictionary<any>, 'key' | 'width' | 'extendType' | 'dictType' | 'filter' | 'filterMultiple'> = {
  key: 'status',
  width: 120,
  extendType: 'dict',
  dictType: 'sys_shared_status',
  filter: true,
  filterMultiple: false,
}

export const WTablePresetCreatedAtColumn: Pick<WTable.Column<any>, 'key' | 'width'> = {
  key: 'createdAt',
  width: 200,
}

export const WTablePresetUpdatedAtColumn: Pick<WTable.Column<any>, 'key' | 'width'> = {
  key: 'updatedAt',
  width: 200,
}
