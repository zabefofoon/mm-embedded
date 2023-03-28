<template>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="crossAxis"
           class="w-20 | text-xs">hidden</label>
    <button class="w-full | px-1 | text-sm border  hover:border-orange-500"
            :class="isHidden ? 'text-slate-500 border-slate-500' : 'text-slate-200 border-slate-200'"
            @click="pageStore.setNodesLayoutHidden(!isHidden)">
      hidden
    </button>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"

const pageStore = usePagesStore()

const isHidden = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].hidden)

</script>

<style scoped>

</style>