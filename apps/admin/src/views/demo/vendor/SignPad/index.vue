<script lang="ts" setup>
import type { ICompVendorSignPadInst } from '@/components/Vendor/SignPad'
import { url } from './url'

defineOptions({
  name: 'SignPadDemo',
})

const signPadRef = useTemplateRef<ICompVendorSignPadInst>('signPadRef')

const imageSrc = ref()

async function onGet() {
  imageSrc.value = await signPadRef.value?.getImage()
}
</script>

<template>
  <WDemoCard title="Signature Pad Demo">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic
        </WTitle>

        <WSignPad height="300px" width="800px" />
      </n-list-item>
    </n-list>

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Disabled
        </WTitle>

        <WSignPad
          height="300px"
          width="800px"
          :default-url="url"
          disabled
        />
      </n-list-item>
    </n-list>

    <n-list>
      <n-list-item>
        <n-space vertical size="small">
          <WTitle prefix="bar" class="mb-2">
            Watermark
          </WTitle>

          <n-button class="mb-2" @click="onGet">
            Get Picture
          </n-button>

          <WSignPad
            ref="signPadRef"
            height="300px"
            width="800px"
            content="walnut admin"
          />

          <n-image :src="imageSrc" />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
