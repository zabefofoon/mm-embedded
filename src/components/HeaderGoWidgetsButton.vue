<template>
  <button
      class="tw-flex tw-items-center | tw-ml-auto tw-p-2 tw-px-2 | tw-rounded-l-full tw-bg-blue-500 hover:tw-bg-orange-500 tw-text-white"
      @click="widgetStore.toggleLayer()">
    <i class="mm-icon mm-icon-grid"></i>
  </button>
</template>

<script setup lang="ts">
import {useWidgetStore} from "../store/widget.store"

const widgetStore = useWidgetStore()
</script>

<style scoped>

</style>