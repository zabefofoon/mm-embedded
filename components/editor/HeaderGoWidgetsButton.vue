<template>
  <button
      class="flex items-center | ml-auto p-2 px-2 | rounded-l-full bg-blue-500 hover:bg-orange-500 text-xl text-white"
      @click="widgetStore.toggleLayer()">
    <i class="icon icon-grid"></i>
  </button>
</template>

<script setup lang="ts">
import {useWidgetStore} from "~/store/widget.store"

const widgetStore = useWidgetStore()
</script>

<style scoped>

</style>