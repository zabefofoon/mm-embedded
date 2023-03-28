<template>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="position"
           class="w-20 | text-xs">position</label>
    <select id="position"
            class="w-full | text-sm border border-white hover:border-orange-500"
            :value="position"
            @change="setNodesLayoutPosition($event)">
      <option>relative</option>
      <option>absolute</option>
      <option>sticky</option>
      <option>fixed</option>
      <option v-show="false" :value="undefined" label="relative"></option>
    </select>
  </li>
  <li class="flex items-start gap-2 | px-3 py-1">
    <label for="inset"
           class="w-20 | text-xs">inset</label>
    <div class="w-full">
      <div class="flex gap-1">
        <div class="flex gap-2 | w-1/2">
          <label for="left"><i class="icon icon-padding-left"></i></label>
          <input id="left"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="left"
                 @change="setNodesLayoutInset('left', $event)"/>
        </div>
        <div class="flex gap-2 | w-1/2">
          <label for="right"><i class="icon icon-padding-right"></i></label>
          <input id="right"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="right"
                 @change="setNodesLayoutInset('right', $event)"/>
        </div>
      </div>
      <div class="flex gap-1">
        <div class="flex gap-2 | w-1/2">
          <label for="top"><i class="icon icon-padding-top"></i></label>
          <input id="top"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="top"
                 @change="setNodesLayoutInset('top', $event)"/>
        </div>
        <div class="flex gap-2 | w-1/2">
          <label for="bottom"><i class="icon icon-padding-bottom"></i></label>
          <input id="bottom"
                 class="w-full | text-sm border border-white hover:border-orange-500"
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