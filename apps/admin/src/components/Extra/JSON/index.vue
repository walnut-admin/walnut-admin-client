<script lang="ts" setup>
import type { ICompExtraJSONProps } from '.'

defineOptions({
  name: 'WCompExtraJSON',
})

const {
  value = {},
  height = '100px',
  copy = true,
} = defineProps<ICompExtraJSONProps>()

const jsonRef = useTemplateRef('jsonRef')
const getJSON = computed(() =>
  typeof value === 'string'
    ? JSON.stringify(JSON.parse(value), null, 2)
    : JSON.stringify(value, null, 2),
)

const isHovered = useElementHover(jsonRef)
</script>

<template>
  <WScrollbar :height="height" class="relative">
    <div ref="jsonRef">
      <n-code :code="getJSON" language="json" word-wrap :trim="false" />

      <WTransition v-if="copy" appear transition-name="fade-right">
        <WCopy
          v-show="isHovered"
          :source="getJSON"
          class="absolute right-2 top-2"
        />
      </WTransition>
    </div>
  </WScrollbar>
</template>
