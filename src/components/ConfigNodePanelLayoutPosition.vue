<template>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="position" class="tw-w-20 | tw-text-xs">Position</label>
    <select
      id="position"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      :value="position"
      @change="setNodesLayoutPosition($event)">
      <option>relative</option>
      <option>absolute</option>
      <option>sticky</option>
      <option>fixed</option>
      <option v-show="false" :value="undefined" label="relative"></option>
    </select>
  </li>
  <li class="tw-flex tw-items-start tw-gap-2 | tw-px-3 tw-py-1">
    <label for="inset" class="tw-w-20 | tw-text-xs">Inset</label>
    <div class="tw-w-full">
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="left"><i class="mm-icon mm-icon-padding-left"></i></label>
          <input
            id="left"
            class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
            placeholder="px"
            :value="left"
            @change="setNodesLayoutInset('left', $event)"
            @keydown.enter=";(<HTMLInputElement>$event.target).blur()" />
        </div>
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="right">
            <i class="mm-icon mm-icon-padding-right"></i>
          </label>
          <input
            id="right"
            class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
            placeholder="px"
            :value="right"
            @change="setNodesLayoutInset('right', $event)"
            @keydown.enter=";(<HTMLInputElement>$event.target).blur()" />
        </div>
      </div>
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="top"><i class="mm-icon mm-icon-padding-top"></i></label>
          <input
            id="top"
            class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
            placeholder="px"
            :value="top"
            @change="setNodesLayoutInset('top', $event)"
            @keydown.enter=";(<HTMLInputElement>$event.target).blur()" />
        </div>
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="bottom">
            <i class="mm-icon mm-icon-padding-bottom"></i>
          </label>
          <input
            id="bottom"
            class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
            placeholder="px"
            :value="bottom"
            @change="setNodesLayoutInset('bottom', $event)"
            @keydown.enter=";(<HTMLInputElement>$event.target).blur()" />
        </div>
      </div>
    </div>
  </li>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="zIndex" class="tw-w-20 | tw-text-xs">Z-Index</label>
    <select
      id="zIndex"
      class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
      :value="zIndex"
      @change="setNodesLayoutZIndex($event)">
      <option :value="undefined" label="0">0</option>
      <option v-for="index in 10" :key="index" :label="String(index)" :value="index"></option>
    </select>
  </li>
</template>

<script setup lang="ts">
import { usePagesStore } from '../store/page.store'
import { computed } from 'vue'
import type { Direction, Position } from '../model/Node'
import { prependUnit } from '../util/util'

const pageStore = usePagesStore()

const position = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].position
)
const left = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].left
)
const right = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].right
)
const top = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].top
)
const bottom = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].bottom
)

const zIndex = computed(
  () =>
    pageStore.selectedNodes[0]?.layout[
      pageStore.selectedNodes[0].selectedResponsiveMode
    ].zIndex || 0
)

const setNodesLayoutPosition = (event: Event) => {
  const value = <Position>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutPosition(value)
}

const setNodesLayoutInset = (direction: Direction, event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutInset(direction, prependUnit(value))
}

const setNodesLayoutZIndex = (event: Event) => {
  const value = (<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutZIndex(Number(value))
}
</script>

<style scoped></style>
