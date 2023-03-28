<template>
  <li class="flex items-start gap-2 | px-3 py-1">
    <label for="padding-left"
           class="w-20 | text-xs">padding</label>
    <div class="w-full">
      <div class="flex gap-1">
        <div class="flex gap-2 | w-1/2">
          <label for="padding-left"><i class="icon icon-padding-left"></i></label>
          <input id="padding-left"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="left"
                 @change="setNodesLayoutPadding('left', $event)"/>
        </div>
        <div class="flex gap-2 | w-1/2">
          <label for="padding-right"><i class="icon icon-padding-right"></i></label>
          <input id="padding-right"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="right"
                 @change="setNodesLayoutPadding('right', $event)"/>
        </div>
      </div>
      <div class="flex gap-1">
        <div class="flex gap-2 | w-1/2">
          <label for="padding-top"><i class="icon icon-padding-top"></i></label>
          <input id="padding-top"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="top"
                 @change="setNodesLayoutPadding('top', $event)"/>
        </div>
        <div class="flex gap-2 | w-1/2">
          <label for="padding-bottom"><i class="icon icon-padding-bottom"></i></label>
          <input id="padding-bottom"
                 class="w-full | text-sm border border-white hover:border-orange-500"
                 placeholder="px"
                 :value="bottom"
                 @change="setNodesLayoutPadding('bottom', $event)"/>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"
import type {Direction} from "../model/Node"

const pageStore = usePagesStore()

const left = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingLeft)
const right = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingRight)
const top = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingTop)
const bottom = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingBottom)

const setNodesLayoutPadding = (direction: Direction, event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutPadding(direction, value)
}
</script>

<style scoped>

</style>