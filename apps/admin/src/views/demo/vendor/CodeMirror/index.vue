<script lang="ts" setup>
defineOptions({
  name: 'CodeMirrorDemo',
})

const code1Raw = import.meta.glob(
  '@/hooks/vueuse/useDark.ts',
  {
    query: 'raw',
    eager: true,
    import: 'default',
  },
)

const code2Raw = import.meta.glob(
  '@/hooks/app/useAppIntro.ts',
  {
    query: 'raw',
    eager: true,
    import: 'default',
  },
)

const code1 = ref(Object.values(code1Raw)[0])
const code2 = ref(Object.values(code2Raw)[0])

const beforeData = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'hiking'],
}

const afterData = {
  name: 'Alice',
  age: 31,
  hobbies: ['reading', 'hiking', 'coding'],
}
</script>

<template>
  <WDemoCard title="CodeMirror Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic (javascript)
        </WTitle>

        <WCodeMirror v-model:value="code1" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Disabled (javascript)
        </WTitle>

        <WCodeMirror v-model:value="code2" disabled />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          JSON Diff
        </WTitle>

        <WCodeMirrorMerge :before="beforeData" :after="afterData" />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
