<template>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="crossAxis"
           class="w-20 | text-xs">transparent</label>
    <button class="w-full | px-1 | text-sm border  hover:border-orange-500"
            :class="transparent ? 'text-slate-500 border-slate-500' : 'text-slate-200 border-slate-200'"
            @click="pageStore.setNodesTransparent(!transparent)">
      transparent
    </button>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"

const pageStore = usePagesStore()

const transparent = computed(() => {
  const selectedResponsiveMode = pageStore.selectedNodes[0]?.selectedResponsiveMode || 'small'
  return pageStore.getSelectedNodeOne()?.layout[selectedResponsiveMode].transparent
})

</script>

<style scoped>

</style>