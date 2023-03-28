<template>
  <VueFinalModal v-slot="{ params, close }"
                 v-bind="$attrs"
                 classes="modal-container"
                 content-class="modal-content w-4/5 h-4/5"
                 @opened="fit">
    <span class="modal__title | flex items-center">
      <span class="text-slate-500">Widgets</span>
      <button class="flex items-center | ml-auto | text-slate-500"
              @click="close()">
        <i class="icon icon-close"></i>
      </button>
    </span>
    <div class="modal__content px-2">
      <div class="flex flex-col gap-16 | h-full">
        <div v-for="(widgetGroup, index) in widgetGroups"
             :key="widgetGroup.name + index"
             class="flex flex-col gap-2">
          <h3 class="text-lg text-slate-500 font-bold">
            {{ widgetGroup.name }}
          </h3>
          <div class="grid grid-cols-6 gap-4">
            <div v-for="(item, itemIndex) in widgetGroup.items"
                 :key="`${index}_${itemIndex}`"
                 class="flex items-center justify-center | w-full aspect-square | border overflow-hidden cursor-pointer hover:border-orange-500"
                 @click="selectWidget(item)">
              <div ref="itemElement"
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
import {useWidgetStore} from "../store/widget.store"
import {storeToRefs} from "pinia"
import {ref} from "vue"
import type {Item} from "../model/Widget"

const emit = defineEmits(['select'])

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)


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

const itemElement = ref<HTMLElement | HTMLElement[]>()

const fit = () => setTimeout(() => {
  if (itemElement.value) Array.isArray(itemElement.value)
      ? Array.from(itemElement.value).forEach((item) => item.style.transform = fitItemToThumbnail(item))
      : itemElement.value.style.transform = fitItemToThumbnail(itemElement.value)
})

const selectWidget = (item: Item) => emit('select', item)
</script>

<style scoped>

</style>