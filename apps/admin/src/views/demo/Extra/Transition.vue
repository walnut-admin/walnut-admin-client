<script lang="ts" setup>
import { random } from 'lodash-es'

defineOptions({
  name: 'TransitionDemo',
  defaultView: false,
})

const show = ref(true)
const formData = ref({
  name: 'fade' as ValueOfAppConstTransitionName,
})

function onStart() {
  show.value = false
  const id = setTimeout(() => {
    show.value = true
    clearTimeout(id)
  }, 1000)
}

const [register] = useForm<typeof formData.value>({
  span: 12,
  schemas: [
    {
      type: 'Extra:TransitionSelect',
      formProp: {
        path: 'name',
      },
    },
    {
      type: 'Base:Button',
      componentProp: {
        textProp: 'Start',
        onClick: onStart,
      },
    },
  ],
})

const nums = ref([1, 2, 3])
const items = computed(() => nums.value.filter(i => i % 2 === 0))

function onAddRandom() {
  nums.value.push(random(3, 100))
}
</script>

<template>
  <WDemoCard title="Transition & Transition Select">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Transition
        </WTitle>

        <WForm :model="formData" @hook="register" />

        <div class="h-36">
          <WTransition :transition-name="formData.name">
            <div v-show="show" class="h-36 w-36 bg-red-400" />
          </WTransition>
        </div>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Transition Group
        </WTitle>

        <n-button class="mb-2" @click="onAddRandom">
          Add Random
        </n-button>

        <div class="flex flex-row flex-wrap gap-2">
          <WTransition :transition-name="formData.name" group>
            <div v-for="(item, index) in items" :key="index" class="h-36 w-36 flex items-center justify-center bg-red-400 text-center text-16 font-bold">
              {{ item }}
            </div>
          </WTransition>
        </div>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
