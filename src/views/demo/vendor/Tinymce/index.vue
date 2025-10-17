<script lang="ts" setup>
defineOptions({
  name: 'TinymceDemo',
})

const value = ref(
  '<p style="text-align: center;"><span style="color: rgb(224, 62, 45); font-size: 36pt;"><em><strong>This is default content</strong></em></span></p>',
)

const _formData = ref({
  title: 'This is default title',
  content:
      '<p style="text-align: center;"><span style="color: rgb(224, 62, 45); font-size: 36pt;"><em><strong>This is default content</strong></em></span></p>',
})

// const [register] = useForm<typeof formData.value>({
//   labelWidth: 120,
//   schemas: [
//     {
//       type: 'Base:Input',
//       formProp: {
//         path: 'title',
//         label: 'Title',
//         required: true,
//       },
//     },
//     {
//       type: 'Vendor:Tinymce',
//       formProp: {
//         path: 'content',
//         label: 'Content',
//         required: true,
//       },
//     },
//   ],
// })
</script>

<template>
  <WDemoCard title="Tinymce Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <pre class="whitespace-pre-wrap">Value: {{ value }}</pre>
        <WTinymce v-model:value="value" />
      </n-list-item>

      <!-- <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Form usage
        </WTitle>

        <pre class="whitespace-pre-wrap">{{ formData }}</pre>

        <WForm :model="formData" @hook="register" />
      </n-list-item> -->
    </n-list>
  </WDemoCard>
</template>

<style lang="scss" scoped></style>
