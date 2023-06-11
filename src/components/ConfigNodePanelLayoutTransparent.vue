<template>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="crossAxis"
           class="tw-w-20 | tw-text-xs">transparent</label>
    <button class="tw-w-full | tw-px-1 | tw-text-sm border hover:tw-border-orange-500"
            :class="transparent ? 'tw-text-slate-500 tw-border-slate-500' : 'tw-text-slate-200 tw-border-slate-200'"
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