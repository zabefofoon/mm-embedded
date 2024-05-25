<template>
  <div class="tw-flex tw-flex-col">
    <h3 class="tw-bg-slate-400 tw-text-white tw-text-sm | tw-px-3 tw-py-1">
      Node
    </h3>
    <ul>
      <li class="tw-flex">
        <button
          class="config-button"
          title="Select parent"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.selectParentNode()">
          <i class="mm-icon mm-icon-select"></i>
          <span class="tw-text-xs">Select Parent</span>
        </button>
      </li>
      <hr />
      <li class="tw-flex">
        <button
          class="config-button"
          title="Add down"
          :disabled="pageStore.selectedNodeIds.length > 2"
          @click="pageStore.addSiblingNodeDown()">
          <i class="mm-icon mm-icon-plus"></i>
          <span class="tw-text-xs">Add</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Add up"
          :disabled="pageStore.selectedNodeIds.length > 1"
          @click="pageStore.addSiblingNodeUp()">
          <i class="mm-icon mm-icon-arrow-up"></i>
          <span class="tw-text-xs">Up</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Add child"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.addChildNode()">
          <i class="mm-icon mm-icon-child"></i>
          <span class="tw-text-xs">Child</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Add parent"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.addParentNode()">
          <i class="mm-icon mm-icon-child tw--rotate-180"></i>
          <span class="tw-text-xs">Parent</span>
        </button>
      </li>
      <hr />
      <li class="tw-flex">
        <button
          class="config-button"
          title="Remove"
          :disabled="!pageStore.selectedNodeIds.length"
          @click="pageStore.removeNode()">
          <i class="mm-icon mm-icon-trash"></i>
          <span class="tw-text-xs">Remove</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Remove parent"
          :disabled="
            pageStore.selectedNodeIds.length !== 1 ||
            !pageStore.getSelectedNodeOne()?.parentId
          "
          @click="pageStore.removeParentNode()">
          <span class="tw-relative">
            <i class="mm-icon mm-icon-trash"></i>
            <i
              class="mm-icon mm-icon-arrow-up tw-text-xs tw-absolute tw--ml-1"></i>
          </span>
          <span class="tw-text-xs">Parent</span>
        </button>
      </li>
      <hr />
      <li class="tw-flex">
        <button
          class="config-button"
          title="Copy"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.copyNode()">
          <i class="mm-icon mm-icon-copy"></i>
          <span class="tw-text-xs">Copy</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Cut"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.cutNode()">
          <i class="mm-icon mm-icon-cut"></i>
          <span class="tw-text-xs">Cut</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Paste"
          :disabled="pageStore.selectedNodeIds.length !== 1"
          @click="pageStore.pasteNode()">
          <i class="mm-icon mm-icon-paste"></i>
          <span class="tw-text-xs">Paste</span>
        </button>
      </li>
      <hr />
      <li class="tw-flex">
        <button
          class="config-button"
          title="Add widget"
          :disabled="pageStore.selectedNodeIds.length === 0"
          @click="open">
          <i class="mm-icon mm-icon-add-widget"></i>
          <span class="tw-text-xs">Widget</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Remove widget"
          @click="pageStore.removeWidget()"
          :disabled="!pageStore.getSelectedNodeOne()?.widget">
          <span class="tw-relative | tw-flex">
            <i class="mm-icon mm-icon-add-widget"></i>
            <i class="mm-icon mm-icon-line | tw-absolute tw-left-0"></i>
          </span>
          <span class="tw-text-xs">Remove</span>
        </button>
      </li>
      <hr />
      <li class="tw-flex">
        <button
          class="config-button"
          title="Add marker"
          :disabled="pageStore.selectedNodeIds.length === 0"
          @click="pageStore.addNodeMarker()">
          <i class="mm-icon mm-icon-marker"></i>
          <span class="tw-text-xs">Marker</span>
        </button>
        <div class="tw-border-l"></div>
        <button
          class="config-button"
          title="Remove marker"
          :disabled="!pageStore.getSelectedNodeOne()?.marker"
          @click="pageStore.removeNodeMarker()">
          <span class="tw-relative | tw-flex">
            <i class="mm-icon mm-icon-marker"></i>
            <i class="mm-icon mm-icon-line | tw-absolute tw-left-0"></i>
          </span>
          <span class="tw-text-xs">Remove</span>
        </button>
      </li>
      <hr />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import type { Item } from '../model/Widget'
import { usePagesStore } from '../store/page.store'
import ModalWidgets from './ModalWidgets.vue'

const pageStore = usePagesStore()

const { open, close } = useModal({
  component: ModalWidgets,
  attrs: {
    onClose() {
      close()
    },
    onSelect(item: Item) {
      pageStore.setWidget(item)
      close()
    }
  }
})
</script>

<style scoped lang="scss">
.config-button {
  width: 100%;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  padding: 0.5rem 0;

  border: 1px solid white;

  &:active {
    background: rgb(241 245 249);
  }

  &:hover {
    border: 1px solid #f97316;
  }

  &:disabled {
    opacity: 0.4;
    border: 1px solid white;
  }
}
</style>
