<template>
  <div v-if="pageStore.pageData.selectedIds.length === 1"
       class="flex flex-col | text-sm">
    <h3 class="bg-slate-400 text-white | px-3 py-1">layout</h3>
    <ResponsiveButton :model-value="pageStore.selectedNodes[0].selectedResponsiveMode"
                      @change="pageStore.selectResponsiveMode($event)"/>
    <ul>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="type" class="w-20 | text-xs">type</label>
        <select id="type"
                class="w-full border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type"
                @change="pageStore.setNodesLayoutType($event.target.value)">
          <option>stack</option>
          <option>grid</option>
        </select>
      </li>
      <li v-if="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type === 'stack'"
          class="flex items-center gap-2 | px-3 py-1">
        <label for="direction"
               class="w-20 | text-xs">direction</label>
        <select id="direction"
                class="w-full border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].direction"
                @change="pageStore.setNodesLayoutStackDirection($event.target.value)">
          <option value="horizontal"
                  label="horizontal"></option>
          <option value="vertical"
                  label="vertical"></option>
          <option v-show="false"
                  :value="undefined"
                  label="mix"></option>
        </select>
      </li>
      <li v-if="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type === 'grid'"
          class="flex items-center gap-2 | px-3 py-1">
        <label for="columns"
               class="w-20 | text-xs">columns</label>
        <input id="columns"
               min="1"
               max="12"
               class="px-1 | w-full | border border-white hover:border-orange-500"
               type="number"
               placeholder="length"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].columns"
               @change="pageStore.setNodesLayoutGridColumns($event.target.value)"/>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="gap"
               class="w-20 | text-xs">gap</label>
        <input id="gap"
               class="px-1 | w-full | border border-white hover:border-orange-500"
               type="number"
               min="0"
               placeholder="px"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].gap"
               @change="pageStore.setNodesLayoutGap($event.target.value)"/>
      </li>
<!--      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="gap"
               class="w-20 | text-xs">crossAxis</label>
        <input id="gap"
               class="px-1 | w-full | border border-white hover:border-orange-500"
               type="number"
               min="0"
               placeholder="px"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].gap"
               @change="pageStore.setNodesLayoutGap($event.target.value)"/>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="gap"
               class="w-20 | text-xs">subAxis</label>
        <input id="gap"
               class="px-1 | w-full | border border-white hover:border-orange-500"
               type="number"
               min="0"
               placeholder="px"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].gap"
               @change="pageStore.setNodesLayoutGap($event.target.value)"/>
      </li>-->
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "~/store/page.store"
import ResponsiveButton from "~/components/atom/ResponsiveButton.vue"

const pageStore = usePagesStore()
</script>

<style scoped lang="scss">

</style>