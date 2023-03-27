<template>
  <div v-if="pageStore.currentPage?.selectedIds.length > 0"
       class="flex flex-col">
    <h3 class="bg-slate-400 text-white text-sm | px-3 py-1">widget</h3>
    <ul>
      <li class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full | text-sm text-left"
                @click="showWidgetModal">
          add
        </button>
      </li>
      <li v-if="pageStore.getSelectedNodeOne()?.widget"
          class="px-3 py-1 | border border-white hover:border-orange-500">
        <button class="w-full | text-sm text-left"
                @click="pageStore.removeWidget()">
          remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {$vfm} from "vue-final-modal"
import ModalWidgets from "./ModalWidgets.vue"
import {Item} from "../model/Widget"

const pageStore = usePagesStore()

const showWidgetModal = () => {
  $vfm.show({
    component: ModalWidgets,
    on: {
      select: (item: Item) => {
        pageStore.setWidget(item)
        $vfm.hideAll()
      }
    }
  })
}
</script>

<style scoped>

</style>