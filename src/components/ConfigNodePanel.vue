<template>
  <aside class="tw-w-96 tw-h-full | tw-border-l tw-overflow-auto | tw-flex tw-flex-col">
    <ConfigWidgetAnalyzePanel v-if="screenStore.screenMode === 'analyzeWidget'"/>
    <template v-else>
      <ConfigNodePanelAdd/>
      <ConfigNodePanelLayout/>
    </template>
  </aside>
</template>

<script setup lang="ts">
import ConfigNodePanelAdd from "./ConfigNodePanelAdd.vue"
import ConfigNodePanelLayout from "./ConfigNodePanelLayout.vue"
import ConfigWidgetAnalyzePanel from "./ConfigWidgetAnalyzePanel.vue"
import {useScreenStore} from "../store/screen.store"

const screenStore = useScreenStore()

</script>

<style scoped>

</style>