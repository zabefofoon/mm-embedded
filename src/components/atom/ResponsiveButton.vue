<template>
  <div class="tw-flex">
    <button class="tw-w-full | tw-py-1 | tw-text-xs tw-border hover:tw-border-slate-400 tw-text-slate-400"
            :class="modelValue === 'small' ? ['tw-font-bold tw-border-slate-500 tw-text-slate-500'] : ['tw-text-slate-300']"
            @click="changeCurrentValue('small')">
      0px~
    </button>
    <button class="tw-w-full | tw-py-1 | tw-text-slate-300 tw-text-xs tw-border hover:tw-border-slate-400 hover:tw-text-slate-400"
            :class="modelValue === 'large' ? ['tw-font-bold tw-border-slate-500 tw-text-slate-500'] : ['tw-text-slate-300']"
            @click="changeCurrentValue('large')">
      768px~
    </button>
  </div>

</template>

<script setup lang="ts">
import {useScreenStore} from "../../store/screen.store"
import type {ResponsiveMode} from "../../model/Node"

defineProps({
  modelValue: {
    type: String,
    default: 'small'
  }
})

const screenStore = useScreenStore()

const emit = defineEmits(['change'])

const changeCurrentValue = (value: ResponsiveMode) => {
  screenStore.setScreenSize('width', value === 'small' ? '33.33%' : '100%')
  emit('change', value)
}
</script>

<style scoped>

</style>