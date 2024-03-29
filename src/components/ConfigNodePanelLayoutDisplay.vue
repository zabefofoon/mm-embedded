<template>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="type" class="tw-w-20 | tw-text-xs">Type</label>
    <select
      id="type"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      :value="type || 'stack'"
      @change="setNodesLayoutType($event)">
      <option>stack</option>
      <option>grid</option>
    </select>
  </li>
  <li
    v-if="type === 'stack'"
    class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="direction" class="tw-w-20 | tw-text-xs">Direction</label>
    <select
      id="direction"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      :value="direction"
      @change="setNodesLayoutStackDirection">
      <option value="horizontal" label="horizontal"></option>
      <option value="vertical" label="vertical"></option>
      <option v-show="false" :value="undefined" label="mix"></option>
    </select>
  </li>
  <li
    v-if="type === 'grid'"
    class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="columns" class="tw-w-20 | tw-text-xs">Columns</label>
    <input
      id="columns"
      min="1"
      max="12"
      class="tw-px-1 | tw-w-full | tw-text-sm border tw-border-white hover:tw-border-orange-500"
      type="number"
      placeholder="length"
      :value="columns"
      @keydown.enter=";(<HTMLInputElement>$event.target).blur()"
      @change="setNodesLayoutGridColumns($event)" />
  </li>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="gap" class="tw-w-20 | tw-text-xs">Gap</label>
    <input
      id="gap"
      class="tw-px-1 | tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      placeholder="px, %, vw"
      :value="gap"
      @keydown.enter=";(<HTMLInputElement>$event.target).blur()"
      @change="setNodesLayoutGap($event)" />
  </li>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="mainAxis" class="tw-w-20 | tw-text-xs">MainAxis</label>
    <select
      id="mainAxis"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      :value="mainAxis"
      @change="setNodesLayoutMainAxis">
      <option>start</option>
      <option>center</option>
      <option>end</option>
      <option>between</option>
      <option v-show="false" :value="undefined" label="start"></option>
    </select>
  </li>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="crossAxis" class="tw-w-20 | tw-text-xs">CrossAxis</label>
    <select
      id="crossAxis"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
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
import { usePagesStore } from '../store/page.store'
import { computed } from 'vue'
import type {
  CrossAxis,
  MainAxis,
  NodeDirection,
  NodeLayoutType,
} from '../model/Node'
import { prependUnit } from '../util/util'

const pageStore = usePagesStore()

const type = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0]?.selectedResponsiveMode
    ]?.type
)
const setNodesLayoutType = (event: Event) => {
  const value = <NodeLayoutType>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutType(value)
}

const direction = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].direction
)
const setNodesLayoutStackDirection = (event: Event) => {
  const value = <NodeDirection>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutStackDirection(value)
}

const columns = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].columns
)
const setNodesLayoutGridColumns = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutGridColumns(Number(value))
}

const gap = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].gap
)
const setNodesLayoutGap = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutGap(prependUnit(value))
}

const mainAxis = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].mainAxis
)
const setNodesLayoutMainAxis = (event: Event) => {
  const value = <MainAxis>(<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutMainAxis(value)
}

const crossAxis = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].crossAxis
)
const setNodesLayoutCrossAxis = (event: Event) => {
  const value = <CrossAxis>(<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutCrossAxis(value)
}
</script>

<style scoped></style>
