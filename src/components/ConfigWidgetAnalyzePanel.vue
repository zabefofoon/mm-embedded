<template>
  <div class="tw-flex tw-flex-col">
    <h3 class="tw-bg-slate-400 tw-text-white tw-text-sm | tw-px-3 tw-py-1">WidgetAnalyze</h3>
    <ul>
      <li v-for="widget in widgetStore.widgets"
          :key="widget.id"
          class="tw-text-sm tw-border-t tw-border-b hover:tw-bg-orange-100">
        <button class="tw-flex | tw-w-full | tw-px-2 tw-py-1 | tw-text-left"
                :class="{'tw-bg-orange-200': widgetStore.selectedUsingWidgetId === widget.id}"
                @click="widgetStore.selectUsingWidget(widget.id)"
                @mouseenter="showPreview(true)"
                @mousemove="attachPreview"
                @mouseleave="showPreview(false)"
                @mouseover="preselectWidget(widget.id)">
          <span class="tw-w-full">{{ widget.name }}</span>
          <span class="tw-ml-auto">{{ widgetStore.getUsingWidgetLength(widget.id) }}</span>
        </button>
      </li>
    </ul>
    <div v-show="isShowPreview"
         ref="widgetPreview"
         class="tw-flex tw-items-center tw-justify-center | tw-w-40 tw-h-40 | tw-fixed | tw-overflow-hidden tw-border tw-pointer-events-none tw-bg-white -tw-translate-x-full">
      <div ref="itemElement"
           v-html="widgetStore.getUsingWidget(preselectedWidgetId)?.html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useWidgetStore} from "../store/widget.store"
import {ref} from "vue"

const widgetStore = useWidgetStore()

const widgetPreview = ref<HTMLDivElement>()

const isShowPreview = ref(false)
const showPreview = (value: boolean) => {
  isShowPreview.value = value
  setTimeout(() => fit())
}
const attachPreview = (event: MouseEvent) => {
  if (widgetPreview.value) {
    fit()
    widgetPreview.value.style.top = event.clientY + 'px'
    widgetPreview.value.style.left = event.clientX + 'px'
  }
}

const preselectedWidgetId = ref<string>()
const preselectWidget = (widgetId?: string) => {
  preselectedWidgetId.value = widgetId
}

const fitItemToThumbnail = (item: HTMLElement) => {
  const thumbnail = item.parentElement
  const thumbnailWidth = thumbnail?.clientWidth || 0
  const thumbnailHeight = thumbnail?.clientHeight || 0
  const biggerAxisThumbnail = thumbnailWidth >= thumbnailHeight ? thumbnailWidth : thumbnailHeight

  const itemWidth = item.clientWidth
  const itemHeight = item.clientHeight
  const biggerAxisItem = itemWidth >= itemHeight ? itemWidth : itemHeight

  return biggerAxisItem >= biggerAxisThumbnail
      ? `scale(${biggerAxisThumbnail / biggerAxisItem - 0.1})`
      : `scale(1)`
}

const itemElement = ref<HTMLElement>()
const fit = () => {
  if (itemElement.value)
    itemElement.value.style.transform = fitItemToThumbnail(itemElement.value)
}
</script>


<style scoped lang="scss">
.widget-preview {
  pointer-events: none;
}
</style>