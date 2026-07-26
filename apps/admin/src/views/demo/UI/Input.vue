<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'

defineOptions({
  name: 'InputDemo',
  defaultView: false,
})

const state = reactive<Recordable>({
  input10: 'walnut-copiable-input',
})

function onChange(value: string) {
  console.log('[WInput change]', value)
}

function onInput(value: string) {
  console.log('[WInput input]', value)
}

function onBlur(e: FocusEvent) {
  console.log('[WInput blur]', e)
}

function onFocus(e: FocusEvent) {
  console.log('[WInput focus]', e)
}

function onClear(e: MouseEvent) {
  console.log('[WInput clear]', e)
}
</script>

<template>
  <WDemoCard title="Input">
    <WJSON :value="state" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Black List
        </WTitle>

        <WInput
          v-model:value="state.input1"
          :black-list="['<', '>']"
          placeholder="'<' and '>' are not allowed to input"
          clearable
          @change="onChange"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
          @clear="onClear"
        />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Password
        </WTitle>

        <WInput
          v-model:value="state.input2"
          type="password"
          show-password-on="mousedown"
          placeholder="Password input"
          clearable
        />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Suffix(prop)
        </WTitle>

        <WInput
          v-model:value="state.input3"
          suffix="123"
          prefix="312"
          placeholder="Suffix/prefix through prop"
          clearable
        />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Suffix Icon(prop)
        </WTitle>

        <WInput
          v-model:value="state.input4"
          suffix-icon="ant-design:home-outlined"
          prefix-icon="ant-design:home-outlined"
          placeholder="Suffix/prefix icon through prop"
          clearable
        />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Help Message
        </WTitle>

        <WInput
          v-model:value="state.input5"
          help-message="Some help message"
          placeholder="With help message"
          clearable
        />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Copiable
        </WTitle>

        <n-space vertical>
          <WInput
            v-model:value="state.input9"
            placeholder="Content inside can be copied"
            clearable
            copiable
          />

          <WInput
            v-model:value="state.input10"
            placeholder="Content inside can be copied"
            clearable
            copiable
          />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Builtin Modifier
        </WTitle>

        <n-space vertical>
          <WInput
            v-model:value.trim="state.input6"
            placeholder="Trim modifier"
            clearable
          />

          <WInput
            v-model:value.capitalize="state.input7"
            placeholder="Capitalize modifier"
            clearable
          />

          <WInput
            v-model:value.uppercase="state.input8"
            placeholder="Uppercase modifier"
            clearable
          />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
