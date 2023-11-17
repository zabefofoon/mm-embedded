<template>
  <li class="tw-flex tw-items-start tw-gap-2 | tw-px-3 tw-py-1">
    <label for="padding-left"
           class="tw-w-20 | tw-text-xs">padding</label>
    <div class="tw-w-full">
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="padding-left"><i class="mm-icon mm-icon-padding-left"></i></label>
          <input id="padding-left"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="left"
                 @change="setNodesLayoutPadding('left', $event)"
                 @keydown.enter="(<HTMLInputElement>$event.target).blur()"/>
        </div>
        <div class="tw-flex gap-2 | tw-w-1/2">
          <label for="padding-right"><i class="mm-icon mm-icon-padding-right"></i></label>
          <input id="padding-right"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="right"
                 @change="setNodesLayoutPadding('right', $event)"
                 @keydown.enter="(<HTMLInputElement>$event.target).blur()"/>
        </div>
      </div>
      <div class="tw-flex tw-gap-1">
        <div class="tw-flex tw-gap-2 | tw-w-1/2">
          <label for="padding-top"><i class="mm-icon mm-icon-padding-top"></i></label>
          <input id="padding-top"
                 class="tw-w-full | tw-text-sm tw-border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="top"
                 @change="setNodesLayoutPadding('top', $event)"
                 @keydown.enter="(<HTMLInputElement>$event.target).blur()"/>
        </div>
        <div class="tw-flex gap-2 | tw-w-1/2">
          <label for="padding-bottom"><i class="mm-icon mm-icon-padding-bottom"></i></label>
          <input id="padding-bottom"
                 class="tw-w-full | tw-text-sm border tw-border-white hover:tw-border-orange-500"
                 placeholder="px"
                 :value="bottom"
                 @change="setNodesLayoutPadding('bottom', $event)"
                 @keydown.enter="(<HTMLInputElement>$event.target).blur()"/>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"
import type {Direction} from "../model/Node"
import { prependUnit } from "../util/util";

const pageStore = usePagesStore()

const left = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingLeft)
const right = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingRight)
const top = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingTop)
const bottom = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingBottom)

const setNodesLayoutPadding = (direction: Direction, event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutPadding(direction, prependUnit(value))
}
</script>

<style scoped>

</style>