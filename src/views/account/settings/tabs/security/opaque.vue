<script lang="ts" setup>
defineOptions({
  name: 'WAccountSettingsTabSecurityOpaque',
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

const [register, { validate }] = useForm<typeof formData.value>({
  inline: true,
  labelPlacement: appStoreAdapter.isMobile ? 'top' : 'left',
  labelAlign: appStoreAdapter.isMobile ? 'left' : 'right',
  labelWidth: 120,

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
    {
      type: 'Base:Button',
      componentProp: {
        textProp: () => t('app.base.save'),
        type: 'primary',
        loading: computed(() => loading.value),
        disabled: computed(() => loading.value),
        debounce: 500,
        onClick: async () => {
          const valid = await validate()

          if (!valid) {
            return
          }

          loading.value = true

          try {
            await userStoreAuth.changePasswordWithOpaque(formData.value.newPasswordConfirm!)
            useAppMsgSuccess()
            resetFormData()
          }
          finally {
            loading.value = false
          }
        },
      },
    },
  ],
})
</script>

<template>
  <div class="w-2/5 max-lg:w-full">
    <!-- @vue-generic {typeof formData.value} -->
    <WForm :model="formData" @hook="register" />
  </div>
</template>
