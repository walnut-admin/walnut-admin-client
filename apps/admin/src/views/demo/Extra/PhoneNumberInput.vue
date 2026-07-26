<script lang="ts" setup>
import type { ICompExtraPhoneNumberInputUpdateParams } from '@/components/Extra/PhoneNumberInput'

defineOptions({
  name: 'PhoneInputDemo',
  defaultView: false,
})

const state = ref<any>({
  phoneNumber1: '13866665555',
  phoneNumber2: '',
  phoneNumber3: '',
  phoneNumber4: '',
  phoneNumber5: '',
  phoneNumber6: '',
  phoneNumber7: '',
  phoneNumber8: '',
  phoneNumber9: '',
})
const updateParams1 = ref<ICompExtraPhoneNumberInputUpdateParams>()

function onUpdate(val: ICompExtraPhoneNumberInputUpdateParams) {
  updateParams1.value = val
}
</script>

<template>
  <WDemoCard title="Phone Number Input">
    <n-list>
      <WJSON :value="{ state, updateParams1 }" height="200px" />

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Normal usage, see console output
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber1" class="w-80" @change="onUpdate" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Get current user country code (if online get when device initial, otherwise use `new Intl.Locale(navigator.language).region` to get country cdoe)
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber2" class="w-80" auto-default-country />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Display an example phone number in placeholder, changes when country select changed
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber3" class="w-80" example />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          No nation flag
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber4" class="w-80" :flag="false" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          No country select, just a normal phone number input
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber5" class="w-80" :country-select="false" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Preferred List, get from `navagator.languages`
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber6" class="w-80" preferred />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          White List, only show passed countries
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber7" class="w-80" :white-list="['CN', 'US', 'JP']" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Black List, no US anymore (HE)
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber8" class="w-80" :black-list="['US']" country-code="CN" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Disabled
        </WTitle>

        <WPhoneNumberInput v-model:value="state.phoneNumber9" class="w-80" disabled />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
