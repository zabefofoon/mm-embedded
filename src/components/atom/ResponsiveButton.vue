<template>
  <div class="flex">
    <button class="w-full | py-1 | text-xs border hover:border-slate-400 text-slate-400"
            :class="modelValue === 'small' ? ['font-bold border-slate-500 text-slate-500'] : ['text-slate-300']"
            @click="changeCurrentValue('small')">
      0px~
    </button>
    <button class="w-full | py-1 | text-slate-300 text-xs border hover:border-slate-400 hover:text-slate-400"
            :class="modelValue === 'large' ? ['font-bold border-slate-500 text-slate-500'] : ['text-slate-300']"
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