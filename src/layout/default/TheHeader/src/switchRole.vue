<script lang="ts" setup>
import { switchRoleAPI } from '@/api/system/user'

defineOptions({
  name: 'TheHeaderDropdownSwitchRole',
})

const { t } = useAppI18n()

const userStoreProfile = useAppStoreUserProfile()
const userStoreAuth = useAppStoreUserAuth()

const { stateRef: formData } = useState({
  roleId: userStoreProfile.getCurrentRole,
})

const getCurrentRoleName = computed(() => userStoreProfile.getRoleList?.find(i => i._id === formData.value.roleId)?.roleName)

const [register, { onOpen }] = useForm<typeof formData.value>({
  showFeedback: false,
  xGap: 0,
  size: 'small',
  dialogPreset: 'modal',
  dialogProps: {
    width: '40%',
    closable: true,
    autoFocus: false,
    fullscreen: false,
    maskClosable: false,
    title: computed(() => t('app.base.switchRole')),
    onYes: async (_, done) => {
      if (formData.value.roleId === userStoreProfile.getCurrentRole) {
        done()
        return
      }

      const { confirmed, inst } = await useAppConfirm(t('app.base.switchRole.confirm', { roleName: getCurrentRoleName.value }), { maskClosable: false })
      if (confirmed) {
        try {
          await switchRoleAPI(formData.value.roleId!)
          useAppMessage()
          await userStoreAuth.ExcuteAfterSwitchRole()
        }
        finally {
          done()
        }
      }
      else {
        inst.destroy()
        // TODO onYes need to expose close fn
        done()
      }
    },
    onNo: (close) => {
      close()
    },
  },
  schemas: [
    {
      type: 'Base:Radio',
      formProp: {
        path: 'roleId',
      },
      componentProp: {
        options: userStoreProfile.getRoleList?.map(i => ({ label: i.roleName!, value: i._id! })),
      },
    },
  ],
})

defineExpose({ onOpen })
</script>

<template>
  <!-- @vue-generic {typeof formData.value} -->
  <WForm :model="formData" @hook="register" />
</template>
