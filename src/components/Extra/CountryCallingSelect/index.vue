<script lang="tsx" setup>
import type { CountryCode } from 'libphonenumber-js'
import type { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import type { VNodeChild } from 'vue'
import type { ICompExtraCountryCallingSelectOption, ICompExtraCountryCallingSelectProps } from '.'
import options from './data'
import './icon.css'

defineOptions({
  name: 'WCompExtraCountryCallingSelect',
})

const { preferred = false, flag = false, disabled = false, autoDefaultCountry = false, blackList, whiteList } = defineProps<ICompExtraCountryCallingSelectProps>()

const value = defineModel<CountryCode>('value', { required: true })

const { t } = useAppI18n()
const { isOnline } = useSharedNetwork()
const { language } = useSharedNavigatorLanguage()
const appStoreGeoIP = useAppStoreGeoIP()

const loading = ref(false)

const getFilterOptions = computed(() => {
  // white list select options
  if (whiteList?.length)
    return options.filter(({ iso2 }) => whiteList!.some(c => c.toUpperCase() === iso2))

  // black list select options
  if (blackList?.length) {
    return options.filter(({ iso2 }) => !blackList!.includes(iso2.toUpperCase())
      && !blackList!.includes(iso2.toLowerCase()))
  }

  return options
})

const getSortOptions = computed<SelectMixedOption[]>(() => {
  // apply preferred select options
  if (preferred) {
    const regions = window.navigator.languages.map(i => new Intl.Locale(i).region)
    const preferred = getFilterOptions.value.filter(i => regions.includes(i.iso2))

    return [
      {
        type: 'group',
        name: t('app.base.preferred'),
        iso2: '999999',
        children: preferred,
      },
      {
        type: 'group',
        name: t('app.base.all'),
        iso2: '000000',
        children: getFilterOptions.value.filter(i => !regions.includes(i.iso2)),
      },
    ]
  }

  return getFilterOptions.value
})

// auto detect user country code
// if user has internet connect, fetch the result from https://ip2c.org/s
// no internet, use `navigator.language` and new `Intl.Locale` to get the `region` as country code
// also when no internet, user change the browser language, the country code change reactively
watch(() => [autoDefaultCountry, isOnline.value, language.value], async () => {
  if (autoDefaultCountry) {
    if (isOnline.value) {
      loading.value = true
      try {
        value.value = appStoreGeoIP.getGeoInfo.country_code as CountryCode
      }
      finally {
        loading.value = false
      }
    }
    else {
      const locale = new Intl.Locale(language.value!)
      value.value = locale.region! as CountryCode
    }
  }
}, { immediate: true, deep: true })

function onRenderLabel(option: ICompExtraCountryCallingSelectOption): VNodeChild {
  if (option?.type === 'group')
    return <div>{option.name}</div>

  return (
    <div class="grid grid-cols-12 w-48 items-center gap-x-1" title={option.name}>
      {flag && (
        <div class="col-span-2">
          <div class={['w-flag', `w-flag-${(option.iso2).toLowerCase()}`]}></div>
        </div>
      )}
      <div class="col-span-3">
        +
        {option.dialCode}
      </div>
      <div class="col-span-auto">{option.name}</div>
    </div>
  )
}

function onRenderTag({ option }: { option: ICompExtraCountryCallingSelectOption }) {
  return (
    <div class="grid grid-cols-12 items-center gap-x-1" title={option.name}>
      {flag && (
        <div class="col-span-5">
          <div class={['w-flag', `w-flag-${option.iso2.toLowerCase()}`]}></div>
        </div>
      )}
      <div class="col-span-7">
        +
        {option.dialCode}
      </div>
    </div>
  )
}

function onFilter(pattern: string, option: ICompExtraCountryCallingSelectOption) {
  const filterableFields = ['name', 'iso2', 'dialCode']

  if (filterableFields.some(i => (option[i] as string).toLowerCase().includes(pattern.toLowerCase())))
    return true

  return false
}
</script>

<template>
  <!-- @vue-expect-error -->
  <WSelect
    v-model:value="value"
    :loading="loading"
    :disabled="loading || disabled"
    :options="getSortOptions"
    value-field="iso2"
    filterable
    :filter="onFilter"
    :placeholder="$t('app.base.countryCode')"
    :render-label="onRenderLabel"
    :render-tag="onRenderTag"
    :menu-props="{ style: 'width: 250px !important' }"
  />
</template>
