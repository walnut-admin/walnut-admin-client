<script lang="ts" setup>
defineOptions({
  name: 'WMeTabSecurityTab1Opaque',
  defaultView: false,
})

const appStoreAdapter = useAppStoreAdapter()
const userStoreAuth = useAppStoreUserAuth()

const { t } = useAppI18n()

const loading = ref(false)

const min = 8
const max = 32

const { stateRef: formData, resetState: resetFormData } = useState({
  newPassword: undefined,
  newPasswordConfirm: undefined,
})

const [register, { onOpen, onClose }] = useForm<typeof formData.value>({
  inline: true,
  labelPlacement: appStoreAdapter.isMobile ? 'top' : 'left',
  labelAlign: appStoreAdapter.isMobile ? 'left' : 'right',
  labelWidth: 120,

  dialogPreset: 'modal',
  dialogProps: {
    width: '40%',
    closable: true,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t('app.security.opaque.title')),
    onYes: async (_, done) => {
      // TODO before set/change password need to do verify if has
      try {
        await userStoreAuth.changePasswordWithOpaque(formData.value.newPasswordConfirm!)
        useAppMsgSuccess()
        resetFormData()
      }
      finally {
        done()
      }

    //   const { confirmed, inst } = await useAppConfirm(t('app.base.switchRole.confirm', { roleName: getCurrentRoleName.value }), { maskClosable: false })
    //   if (confirmed) {
    //     try {
    //       await switchRoleAPI(formData.value.roleId!)
    //       useAppMessage()
    //       await userStoreAuth.ExecuteAfterSwitchRole()
    //     }
    //     finally {
    //       done()
    //     }
    //   }
    //   else {
    //     inst.destroy()
    //     // TODO onYes need to expose close fn
    //     done()
    //   }
    },
    onNo: (close) => {
      close()
    },
  },

  baseRules: true,

  rules: {
    newPassword: [
      { min, message: computed(() => t('form.base.rule.min', { min })), trigger: ['input', 'blur'] },
      { max, message: computed(() => t('form.base.rule.max', { max })), trigger: ['input', 'blur'] },
    ],
    newPasswordConfirm: [
      { min, message: computed(() => t('form.base.rule.min', { min })), trigger: ['input', 'blur'] },
      { max, message: computed(() => t('form.base.rule.max', { max })), trigger: ['input', 'blur'] },
      { validator: (_, val) => (val === formData.value.newPassword), message: computed(() => t('app.base.pass.new.notMatch')), trigger: ['input', 'blur'] },
    ],
  },

  disabled: computed(() => loading.value),
  schemas: [
    {
      type: 'Extra:Password',
      formProp: {
        path: 'newPassword',
        label: computed(() => t('app.base.pass.new')),
        first: true,
      },
      componentProp: {
        clearable: true,
        capslock: true,
        progress: true,
        minlength: min,
        maxlength: max,
      },
    },
    {
      type: 'Extra:Password',
      formProp: {
        path: 'newPasswordConfirm',
        label: computed(() => t('app.base.pass.new.confirm')),
        first: true,
      },
      componentProp: {
        clearable: true,
        capslock: true,
        progress: true,
        minlength: min,
        maxlength: max,
      },
    },
  ],
})

defineExpose({
  onOpen,
  onClose,
})
</script>

<template>
  <!-- @vue-generic {typeof formData.value} -->
  <WForm :model="formData" @hook="register" />
</template>
