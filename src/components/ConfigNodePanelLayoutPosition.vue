<template>
  <li class="tw-flex tw-items-center tw-gap-2 | tw-px-3 tw-py-1">
    <label for="position"
           class="tw-w-20 | tw-text-xs">position</label>
    <select id="position"
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
    <label for="inset"
           class="tw-w-20 | tw-text-xs">inset</label>
    <div class="tw-w-full">
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="left"><i class="mm-icon mm-icon-padding-left"></i></label>
          <input id="left"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="left"
                 @change="setNodesLayoutInset('left', $event)"/>
        </div>
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="right"><i class="mm-icon mm-icon-padding-right"></i></label>
          <input id="right"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="right"
                 @change="setNodesLayoutInset('right', $event)"/>
        </div>
      </div>
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="top"><i class="mm-icon mm-icon-padding-top"></i></label>
          <input id="top"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="top"
                 @change="setNodesLayoutInset('top', $event)"/>
        </div>
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="bottom"><i class="mm-icon mm-icon-padding-bottom"></i></label>
          <input id="bottom"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="bottom"
                 @change="setNodesLayoutInset('bottom', $event)"/>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"
import type {Direction, Position} from "../model/Node"

const pageStore = usePagesStore()

const position = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].position)
const left = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].left)
const right = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].right)
const top = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].top)
const bottom = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].bottom)

const setNodesLayoutPosition = (event: Event) => {
  const value = <Position>(<HTMLSelectElement>event.target).value
  pageStore.setNodesLayoutPosition(value)
}

const setNodesLayoutInset = (direction: Direction, event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutInset(direction, value)
}
</script>

<style scoped>

</style>