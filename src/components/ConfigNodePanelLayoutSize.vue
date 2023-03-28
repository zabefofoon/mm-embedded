<template>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="width"
           class="w-20 | text-xs">width</label>
    <input id="width"
           class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
           placeholder="px, %, vw"
           :value="width"
           @keydown.stop
           @change="setNodesLayoutWidth($event)"/>
  </li>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="height"
           class="w-20 | text-xs">height</label>
    <input id="height"
           class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
           placeholder="px, %, vw"
           :value="height"
           @keydown.stop
           @change="setNodesLayoutHeight"/>
  </li>
  <li class="flex items-center gap-2 | px-3 py-1">
    <label for="max-width"
           class="w-20 | text-xs">maxWidth</label>
    <input id="max-width"
           class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
           placeholder="px, %, vw"
           :value="maxWidth"
           @keydown.stop
           @change="setNodesLayoutMaxWidth($event)"/>
  </li>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"

const pageStore = usePagesStore()

const width = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].width)

const setNodesLayoutWidth = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutWidth(value)
}

const maxWidth = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].maxWidth)

const setNodesLayoutMaxWidth = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutMaxWidth(value)
}

const height = computed(() => pageStore.selectedNodes[0]?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].height)

const setNodesLayoutHeight = (event: Event) => {
  const value = (<HTMLInputElement>event.target).value
  pageStore.setNodesLayoutHeight(value)
}
</script>

<style scoped>

</style>