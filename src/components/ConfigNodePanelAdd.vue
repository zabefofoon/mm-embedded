<template>
  <div class="flex flex-col">
    <h3 class="bg-slate-400 text-white text-sm | px-3 py-1">node</h3>
    <ul>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.selectParentNode()">select parent
        </button>
      </li>
      <hr v-if="pageStore.selectedNodeIds.length === 1"
          class="my-2"/>
      <li v-if="pageStore.selectedNodeIds.length === 0"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.addSiblingNodeUp()">add
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.addSiblingNodeUp()">add sibling up
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.addSiblingNodeDown()">add sibling down
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length === 1 && !pageStore.getSelectedNodeOne()?.widget"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.addChildNode()">add child
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.addParentNode()">add parent
        </button>
      </li>
      <hr v-if="pageStore.selectedNodeIds.length === 1"
          class="my-2"/>
      <li v-if="pageStore.selectedNodeIds.length > 0"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.removeNode()">remove
        </button>
      </li>
      <li v-if="isShowRemoveParent"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.removeParentNode()">remove parent
        </button>
      </li>
      <hr v-if="pageStore.selectedNodeIds.length === 1 || pageStore.copiedNode"
          class="my-2"/>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.copyNode()">copy
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length === 1"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 |  text-sm text-left"
                @click="pageStore.cutNode()">cut
        </button>
      </li>
      <li v-if="pageStore.selectedNodeIds.length < 2 && pageStore.copiedNode && !pageStore.getSelectedNodeOne()?.widget"
          class="border border-white hover:border-orange-500">
        <button class="w-full | px-3 py-1 | text-sm text-left"
                @click="pageStore.pasteNode()">paste
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"

const pageStore = usePagesStore()

const isShowRemoveParent = computed(() => pageStore.selectedNodeIds.length === 1
    && (pageStore.findNode(pageStore.getSelectedNodeOne()?.parentId)?.nodes || []).length < 2)
</script>

<style scoped lang="scss">

</style>