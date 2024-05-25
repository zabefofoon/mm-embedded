<template>
  <VueFinalModal
    v-bind="$attrs"
    class="mm-modal-container"
    content-class="mm-modal-content | tw-w-4/5 tw-h-4/5"
    @opened="fit">
    <span class="mm-modal__title | tw-flex tw-items-center">
      <span class="tw-text-slate-500">Widgets</span>
      <button
        class="tw-flex tw-items-center | tw-ml-auto | tw-text-slate-500"
        @click="emit('close')">
        <i class="mm-icon mm-icon-close"></i>
      </button>
    </span>
    <div class="mm-modal__content | tw-px-2">
      <div class="tw-flex tw-flex-col tw-gap-16 | tw-h-full">
        <div
          v-for="(widgetGroup, index) in widgetGroups"
          :key="widgetGroup.name + index"
          class="tw-flex tw-flex-col tw-gap-2">
          <h3 class="tw-text-lg tw-text-slate-500 tw-font-bold">
            {{ widgetGroup.name }}
          </h3>
          <div class="tw-grid tw-grid-cols-6 tw-gap-4">
            <div
              v-for="(item, itemIndex) in widgetGroup.items"
              :key="`${index}_${itemIndex}`"
              class="tw-flex tw-items-center tw-justify-center | tw-w-full tw-aspect-square | tw-border tw-overflow-hidden tw-cursor-pointer hover:tw-border-orange-500"
              @click="selectWidget(item)">
              <div
                ref="itemElement"
                :id="item.id"
                v-html="item.html"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { useWidgetStore } from '../store/widget.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Item } from '../model/Widget'
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits(['select', 'close'])

const widgetStore = useWidgetStore()
const { widgetGroups } = storeToRefs(widgetStore)

const fitItemToThumbnail = (item: HTMLElement) => {
  const thumbnail = item.parentElement
  const thumbnailWidth = thumbnail?.clientWidth || 0
  const thumbnailHeight = thumbnail?.clientHeight || 0
  const biggerAxisThumbnail =
    thumbnailWidth >= thumbnailHeight ? thumbnailWidth : thumbnailHeight

  const itemWidth = item.clientWidth
  const itemHeight = item.clientHeight
  const biggerAxisItem = itemWidth >= itemHeight ? itemWidth : itemHeight

  return biggerAxisItem >= biggerAxisThumbnail
    ? `scale(${biggerAxisThumbnail / biggerAxisItem - 0.1})`
    : `scale(1)`
}

const itemElement = ref<HTMLElement | HTMLElement[]>()

const fit = () =>
  setTimeout(() => {
    if (itemElement.value)
      Array.isArray(itemElement.value)
        ? Array.from(itemElement.value).forEach(
            item => (item.style.transform = fitItemToThumbnail(item))
          )
        : (itemElement.value.style.transform = fitItemToThumbnail(
            itemElement.value
          ))
  })

const selectWidget = (item: Item) => emit('select', item)
</script>

<style scoped></style>
