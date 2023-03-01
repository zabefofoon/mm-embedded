<template>
  <aside class="w-96 | border-l | flex flex-col gap-3">
    <ConfigNodePanelAdd/>
    <ConfigNodePanelLayout/>
    <ConfigNodePanelWidget/>
  </aside>
</template>

<script setup lang="ts">
import ConfigNodePanelAdd from "~/components/editor/ConfigNodePanelAdd.vue"
import ConfigNodePanelLayout from "~/components/editor/ConfigNodePanelLayout.vue"
import ConfigNodePanelWidget from "~/components/editor/ConfigNodePanelWidget.vue"
</script>

<style scoped>

</style>