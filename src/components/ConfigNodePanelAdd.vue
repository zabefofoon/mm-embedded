<template>
  <div class="flex flex-col">
    <h3 class="bg-slate-400 text-white text-sm | px-3 py-1">Node</h3>
    <ul>
      <li class="flex">
        <button class="button"
                title="Select parent"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.selectParentNode()">
          <i class="icon icon-select"></i>
          <span class="text-xs">select Parent</span>
        </button>
      </li>
      <hr/>
      <li class="flex">
        <button class="button"
                title="Add down"
                :disabled="pageStore.selectedNodeIds.length > 2"
                @click="pageStore.addSiblingNodeDown()">
          <i class="icon icon-plus"></i>
          <span class="text-xs">add</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Add up"
                :disabled="pageStore.selectedNodeIds.length > 1"
                @click="pageStore.addSiblingNodeUp()">
          <i class="icon icon-arrow-up"></i>
          <span class="text-xs">up</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Add child"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.addChildNode()">
          <i class="icon icon-child"></i>
          <span class="text-xs">child</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Add parent"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.addParentNode()">
          <i class="icon icon-child -rotate-180"></i>
          <span class="text-xs">parent</span>
        </button>
      </li>
      <hr/>
      <li class="flex">
        <button class="button"
                title="Remove"
                :disabled="!pageStore.selectedNodeIds.length"
                @click="pageStore.removeNode()">
          <i class="icon icon-trash"></i>
          <span class="text-xs">remove</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Remove parent"
                :disabled="pageStore.selectedNodeIds.length !== 1 || !pageStore.getSelectedNodeOne()?.parentId"
                @click="pageStore.removeParentNode()">
          <span class="relative">
            <i class="icon icon-trash"></i>
            <i class="icon icon-arrow-up text-xs absolute -ml-1"></i>
          </span>
          <span class="text-xs">parent</span>
        </button>
      </li>
      <hr/>
      <li class="flex">
        <button class="button"
                title="Copy"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.copyNode()">
          <i class="icon icon-copy"></i>
          <span class="text-xs">copy</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Cut"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.cutNode()">
          <i class="icon icon-cut"></i>
          <span class="text-xs">cut</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Paste"
                :disabled="pageStore.selectedNodeIds.length !== 1"
                @click="pageStore.pasteNode()">
          <i class="icon icon-paste"></i>
          <span class="text-xs">paste</span>
        </button>
      </li>
      <hr/>
      <li class="flex">
        <button class="button"
                title="Add widget"
                :disabled="pageStore.selectedNodeIds.length === 0"
                @click="showWidgetModal">
          <i class="icon icon-add-widget"></i>
          <span class="text-xs">widget</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Remove widget"
                @click="pageStore.removeWidget()"
                :disabled="!pageStore.getSelectedNodeOne()?.widget">
          <span class="relative | flex">
            <i class="icon icon-add-widget"></i>
            <i class="icon icon-line | absolute left-0"></i>
          </span>
          <span class="text-xs">remove</span>
        </button>
      </li>
      <hr/>
      <li class="flex">
        <button class="button"
                title="Add marker"
                :disabled="pageStore.selectedNodeIds.length === 0"
                @click="pageStore.addNodeMarker()">
          <i class="icon icon-marker"></i>
          <span class="text-xs">marker</span>
        </button>
        <div class="border-l"></div>
        <button class="button"
                title="Remove marker"
                :disabled="!pageStore.getSelectedNodeOne()?.marker"
                @click="pageStore.removeNodeMarker()">
          <span class="relative | flex">
            <i class="icon icon-marker"></i>
            <i class="icon icon-line | absolute left-0"></i>
          </span>
          <span class="text-xs">remove</span>
        </button>
      </li>
      <hr/>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed} from "vue"
import {$vfm} from "vue-final-modal"
import ModalWidgets from "./ModalWidgets.vue"
import {Item} from "../model/Widget"

const pageStore = usePagesStore()

const isShowRemoveParent = computed(() => pageStore.selectedNodeIds.length === 1
    && (pageStore.findNode(pageStore.getSelectedNodeOne()?.parentId)?.nodes || []).length < 2)

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

<style scoped lang="scss">
.button {
  width: 100%;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: .25rem;

  padding: .5rem 0;

  border: 1px solid white;

  &:active {
    background: rgb(241 245 249);
  }

  &:hover {
    border: 1px solid #f97316;
  }

  &:disabled {
    opacity: .4;
    border: 1px solid white;
  }
}
</style>