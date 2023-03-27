<template>
  <aside class="w-96 h-full | pb-20 | border-l overflow-auto | flex flex-col gap-3">
    <ConfigNodePanelAdd/>
    <ConfigNodePanelLayout/>
    <ConfigNodePanelWidget/>
    <ConfigNodePanelMarker/>
  </aside>
</template>

<script setup lang="ts">
import ConfigNodePanelAdd from "./ConfigNodePanelAdd.vue"
import ConfigNodePanelLayout from "./ConfigNodePanelLayout.vue"
import ConfigNodePanelWidget from "./ConfigNodePanelWidget.vue"
import ConfigNodePanelMarker from "./ConfigNodePanelMarker.vue"</script>

<style scoped>

</style>