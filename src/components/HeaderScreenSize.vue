<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <IconButton
      icon="mm-icon-screen-xl"
      @click="selectSize('100%')"
      :active="screenStore.screenSize.width === '100%'" />
    <IconButton
      icon="mm-icon-screen-l"
      @click="selectSize('75%')"
      :active="screenStore.screenSize.width === '75%'" />
    <IconButton
      icon="mm-icon-screen-m"
      @click="selectSize('50%')"
      :active="screenStore.screenSize.width === '50%'" />
    <IconButton
      icon="mm-icon-screen-s"
      @click="selectSize('33.33%')"
      :active="screenStore.screenSize.width === '33.33%'" />
    <!-- <IconDivider/>
    <div class="tw-flex tw-items-center tw-gap-3">
      <input class="tw-w-20 | tw-px-1 | tw-border tw-text-sm"
             placeholder="width"
             v-model="screenStore.screenSize.width"/>
      <span class="tw-text-sm">x</span>
      <input class="tw-w-20 | tw-px-1 | tw-border tw-text-sm tw-bg-slate-100"
             placeholder="height"
             v-model="screenStore.screenSize.height"
             disabled/>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveMode } from '../model/Node'
import { usePagesStore } from '../store/page.store'
import { useScreenStore } from '../store/screen.store'
import IconButton from './atom/IconButton.vue'

const screenStore = useScreenStore()
const pageStore = usePagesStore()

const selectSize = (size: string) => {
  screenStore.setScreenSize('width', size)
  pageStore.nodeForEach((node) => node.selectResponsiveMode(sizeMap[size]))
}

const sizeMap: { [key in string]: ResponsiveMode } = {
  '100%': 'large',
  '75%': 'large',
  '50%': 'small',
  '33.33%': 'small',
}
</script>

<style scoped lang="scss"></style>
