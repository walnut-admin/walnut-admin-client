import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'

export const logOperateFormSchema: WForm.Schema.Item<IModels.SystemLogOperate>[] = [
  {
    type: 'Base:Input',
    formProp: {
      path: 'title',
    },
    descriptionProp: {
      span: 1,
    },
  },

  {
    type: 'Business:Dict',
    formProp: {
      path: 'actionType',
    },
    descriptionProp: {
      span: 1,
      type: 'dict',
      typeProps: {
        dictType: 'sys_operate_type',
      },
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'method',
    },
    descriptionProp: {
      span: 1,
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'userName',
    },
    descriptionProp: {
      span: 1,
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'success',
    },
    descriptionProp: {
      span: 1,
      type: 'dict',
      typeProps: {
        dictType: 'sys_shared_success',
      },
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'statusCode',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'url',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'os',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'ip',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'location',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'browser',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'invokingMethod',
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'correspondingMS',
    },
    descriptionProp: { formatter: ms => `${ms} ms` },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'requestData',
    },
    descriptionProp: {
      type: 'json',
      typeProps: {
        height: '200px',
      },
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'responseData',
    },
    descriptionProp: {
      type: 'json',
      typeProps: {
        height: '200px',
      },
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      path: 'operatedAt',
    },
  },
]
