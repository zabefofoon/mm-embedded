<template>
  <aside class="w-96 h-full | pb-20 | border-l overflow-scroll | flex flex-col gap-3">
    <ConfigNodePanelAdd/>
    <ConfigNodePanelLayout/>
    <ConfigNodePanelWidget/>
    <ConfigNodePanelMarker/>
  </aside>
</template>

<script setup lang="ts">
import ConfigNodePanelAdd from "~/components/editor/ConfigNodePanelAdd.vue"
import ConfigNodePanelLayout from "~/components/editor/ConfigNodePanelLayout.vue"
import ConfigNodePanelWidget from "~/components/editor/ConfigNodePanelWidget.vue"
import ConfigNodePanelMarker from "~/components/editor/ConfigNodePanelMarker.vue"
</script>

<style scoped>

</style>