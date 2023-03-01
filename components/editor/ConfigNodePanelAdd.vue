<template>
  <div class="flex flex-col">
    <h3 class="bg-slate-400 text-white text-sm | px-3 py-1">node</h3>
    <ul>
      <li class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full | text-sm text-left"
                @click="pageStore.addSiblingNode()">add sibling
        </button>
      </li>
      <li class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full | text-sm text-left"
                @click="pageStore.addChildNode()">add child
        </button>
      </li>
      <li class="px-3 py-1 | border border-white hover:border-orange-500"
          :class="{'text-slate-300': pageStore.pageData.selectedIds.length === 0}">
        <button class="w-full | text-sm text-left"
                @click="pageStore.removeNode()">remove node
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "~/store/page.store"

const pageStore = usePagesStore()
</script>

<style scoped>

</style>