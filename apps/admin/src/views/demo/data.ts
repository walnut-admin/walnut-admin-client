import type { TreeNodeItem } from 'easy-fns-ts'

export const options = [
  {
    value: 1,
    label: 'Beijing',
  },
  {
    value: 2,
    label: 'New York City',
    disabled: true,
  },
  {
    value: 3,
    label: 'Paris',
  },
  {
    value: 4,
    label: 'Tokyo',
  },
  {
    value: 5,
    label: 'London',
  },
]

export function getTreeData(): TreeNodeItem<{
  _id: number
  _label: string
  icon: string
  _disabled?: boolean
}>[] {
  return [
    {
      _id: 1,
      _label: 'Level 1',
      icon: 'ant-design:home-outlined',
      children: [
        {
          _id: 4,
          _label: 'Level 1-1',
          icon: 'ant-design:home-outlined',
          children: [
            {
              _id: 9,
              _label: 'Level 1-1-1',
              icon: 'ant-design:home-outlined',
            },
            {
              _id: 10,
              _label: 'Level 1-1-2',
              icon: 'ant-design:home-outlined',
            },
          ],
        },
        {
          _id: 11,
          _label: 'Level 1-2',
          icon: 'ant-design:home-outlined',
          children: [
            {
              _id: 12,
              _label: 'Level 1-2-1',
              icon: 'ant-design:home-outlined',
            },
            {
              _id: 13,
              _label: 'Level 1-2-2',
              icon: 'ant-design:home-outlined',
              _disabled: true,
            },
          ],
        },
      ],
    },
    {
      _id: 2,
      _label: 'Level 2',
      icon: 'ant-design:home-outlined',
      children: [
        {
          _id: 5,
          _label: 'Level 2-1',
          icon: 'ant-design:home-outlined',
          children: [
            {
              _id: 14,
              _label: 'Level 2-1-1',
              icon: 'ant-design:home-outlined',
            },
            {
              _id: 15,
              _label: 'Level 2-1-2',
              icon: 'ant-design:home-outlined',
            },
          ],
        },
        {
          _id: 6,
          _label: 'Level 2-2',
          icon: 'ant-design:home-outlined',
          children: [
            {
              _id: 16,
              _label: 'Level 2-2-1',
              icon: 'ant-design:home-outlined',
            },
            {
              _id: 17,
              _label: 'Level 2-2-2',
              icon: 'ant-design:home-outlined',
            },
          ],
        },
      ],
    },
    {
      _id: 3,
      _label: 'Level 3',
      icon: 'ant-design:home-outlined',
      children: [
        {
          _id: 7,
          _label: 'Level 3-1',
          icon: 'ant-design:home-outlined',
        },
        {
          _id: 8,
          _label: 'Level 3-2',
          icon: 'ant-design:home-outlined',
        },
      ],
    },
  ]
}
