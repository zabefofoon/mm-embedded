<template>
  <div class="flex flex-col | text-sm">
    <h3 class="bg-slate-400 text-white | px-3 py-1">add / remove</h3>
    <ul>
      <li class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full text-left"
                @click="pageStore.addSiblingNode()">sibling
        </button>
      </li>
      <li class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full text-left"
                @click="pageStore.addChildNode()">child
        </button>
      </li>
      <li class="px-3 py-1 | border border-white hover:border-orange-500"
          :class="{'text-slate-300': pageStore.pageData.selectedIds.length === 0}">
        <button class="w-full text-left"
                @click="pageStore.removeNode()">remove
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