<template>
  <div v-if="pageStore.selectedNodeIds.length === 1"
       class="flex flex-col">
    <h3 class="bg-slate-400 text-white text-sm | px-3 py-1">marker</h3>
    <ul>
      <li v-if="!pageStore.getSelectedNodeOne()?.marker"
          class="px-3 py-1 | border border-white hover:border-orange-500">
        <button
                class="w-full | text-sm text-left"
                @click="pageStore.addNodeMarker()">
          add
        </button>
      </li>
      <li v-else
          class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full | text-sm text-left"
                @click="pageStore.removeNodeMarker()">
          remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"

const pageStore = usePagesStore()
</script>

<style scoped>

</style>