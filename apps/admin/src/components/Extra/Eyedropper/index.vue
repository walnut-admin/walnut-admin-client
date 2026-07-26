<script lang="ts" setup>
defineOptions({
  name: 'WCompExtraEyedropper',
})

const emits = defineEmits<{ choose: [sRGB: string] }>()

const { open, sRGBHex, isSupported } = useEyeDropper()

function onClick() {
  open()
}

watchEffect(() => {
  if (!isSupported.value)
    return
  if (sRGBHex.value) {
    // TODO now only sRGB
    emits('choose', sRGBHex.value)
  }
})
</script>

<template>
  <WIconButton :icon-props="{ icon: 'mdi:eyedropper' }" :button-props="{ onClick }" />
</template>
