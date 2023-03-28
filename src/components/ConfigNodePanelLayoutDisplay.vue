<template>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="type" class="w-20 | text-xs">type</label>
    <select id="type"
            class="w-full | text-sm border border-white hover:border-orange-500"
            :value="type"
            @change="setNodesLayoutType($event)">
      <option>stack</option>
      <option>grid</option>
    </select>
  </li>
  <li v-if="type === 'stack'"
      class="flex items-center gap-2 | px-3 py-1">
    <label for="direction"
           class="w-20 | text-xs">direction</label>
    <select id="direction"
            class="w-full | text-sm border border-white hover:border-orange-500"
            :value="direction"
            @change="setNodesLayoutStackDirection">
      <option value="horizontal"
              label="horizontal"></option>
      <option value="vertical"
              label="vertical"></option>
      <option v-show="false"
              :value="undefined"
              label="mix"></option>
    </select>
  </li>
  <li v-if="type === 'grid'"
      class="flex items-center gap-2 | px-3 py-1">
    <label for="columns"
           class="w-20 | text-xs">columns</label>
    <input id="columns"
           min="1"
           max="12"
           class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
           type="number"
           placeholder="length"
           :value="columns"
           @keydown.stop
           @change="setNodesLayoutGridColumns($event)"/>
  </li>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="gap"
           class="w-20 | text-xs">gap</label>
    <input id="gap"
           class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
           placeholder="px, %, vw"
           :value="gap"
           @keydown.stop
           @change="setNodesLayoutGap($event)"/>
  </li>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="mainAxis"
           class="w-20 | text-xs">mainAxis</label>
    <select id="mainAxis"
            class="w-full | text-sm border border-white hover:border-orange-500"
            :value="mainAxis"
            @change="setNodesLayoutMainAxis">
      <option>start</option>
      <option>center</option>
      <option>end</option>
      <option>between</option>
      <option v-show="false" :value="undefined" label="start"></option>
    </select>
  </li>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="crossAxis"
           class="w-20 | text-xs">crossAxis</label>
    <select id="crossAxis"
            class="w-full | text-sm border border-white hover:border-orange-500"
            :value="crossAxis"
            @change="setNodesLayoutCrossAxis">
      <option>start</option>
      <option>center</option>
      <option>end</option>
      <option v-show="false" :value="undefined" label="start"></option>
    </select>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"
import type {CrossAxis, MainAxis, NodeDirection, NodeLayoutType} from "../model/Node"

const pageStore = usePagesStore()

const type = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0]?.selectedResponsiveMode]?.type)
const setNodesLayoutType = (event: Event) => {
  const value = <NodeLayoutType>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutType(value)
}

const direction = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].direction)
const setNodesLayoutStackDirection = (event: Event) => {
  const value = <NodeDirection>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutStackDirection(value)
}


const columns = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].columns)
const setNodesLayoutGridColumns = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutGridColumns(Number(value))
}


const gap = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].gap)
const setNodesLayoutGap = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutGap(value)
}

const mainAxis = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].mainAxis)
const setNodesLayoutMainAxis = (event: Event) => {
  const value = <MainAxis>(<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutMainAxis(value)
}

const crossAxis = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].crossAxis)
const setNodesLayoutCrossAxis = (event: Event) => {
  const value = <CrossAxis>(<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutCrossAxis(value)
}
</script>

<style scoped>

</style>