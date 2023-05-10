<template>
  <div v-if="pageStore.selectedNodeIds.length === 1"
       class="flex flex-col">
    <h3 class="bg-slate-400 text-white | px-3 py-1 | text-sm">layout</h3>
    <ResponsiveButton :model-value="pageStore.selectedNodes[0]?.selectedResponsiveMode"
                      @change="pageStore.selectResponsiveMode($event)"/>
    <ul>
      <ConfigNodePanelLayoutDisplay/>
      <hr class="my-2"/>
      <ConfigNodePanelLayoutHidden/>
      <hr class="my-2"/>
      <ConfigNodePanelLayoutSize/>
      <hr class="my-2"/>
      <ConfigNodePanelLayoutPadding/>
      <hr class="my-2"/>
      <ConfigNodePanelLayoutTransparent/>
      <hr class="my-2"/>
      <ConfigNodePanelLayoutPosition/>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import ResponsiveButton from "./atom/ResponsiveButton.vue"
import ConfigNodePanelLayoutDisplay from "./ConfigNodePanelLayoutDisplay.vue"
import ConfigNodePanelLayoutHidden from "./ConfigNodePanelLayoutHidden.vue"
import ConfigNodePanelLayoutSize from "./ConfigNodePanelLayoutSize.vue"
import ConfigNodePanelLayoutPadding from "./ConfigNodePanelLayoutPadding.vue"
import ConfigNodePanelLayoutTransparent from "./ConfigNodePanelLayoutTransparent.vue"
import ConfigNodePanelLayoutPosition from "./ConfigNodePanelLayoutPosition.vue"

const pageStore = usePagesStore()
</script>

<style scoped lang="scss">

</style>