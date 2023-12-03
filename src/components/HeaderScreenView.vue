<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <IconButton
      v-if="!$route.query.hideSpacing"
      icon="mm-icon-spacing"
      :active="screenStore.isShowSpacing"
      title="Toggle spacing"
      @click="screenStore.toggleShowSpacing()" />
    <IconButton
      v-if="!$route.query.hideOutline"
      icon="mm-icon-outline"
      :active="screenStore.isShowOutline"
      title="Toggle outline"
      @click="screenStore.toggleShowOutline()" />
    <IconButton
      v-if="!$route.query.hideHidden"
      icon="mm-icon-hidden"
      :active="screenStore.isShowHidden"
      title="Toggle hidden elements"
      @click="screenStore.toggleShowHidden()" />
    <IconButton
      v-if="!$route.query.hideMarker"
      icon="mm-icon-marker"
      :active="screenStore.isShowMarker"
      title="Toggle marker"
      @click="screenStore.toggleMarker()" />
  </div>
</template>

<script setup lang="ts">
import IconButton from './atom/IconButton.vue'
import { useScreenStore } from '../store/screen.store'

const screenStore = useScreenStore()
</script>

<style scoped></style>
