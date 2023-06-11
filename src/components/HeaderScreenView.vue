<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <IconButton icon="mm-icon-spacing"
                :active="screenStore.isShowSpacing"
                @click="screenStore.toggleShowSpacing()"/>
    <IconButton icon="mm-icon-outline"
                :active="screenStore.isShowOutline"
                @click="screenStore.toggleShowOutline()"/>
    <IconButton icon="mm-icon-hidden"
                :active="screenStore.isShowHidden"
                @click="screenStore.toggleShowHidden()"/>
    <IconButton icon="mm-icon-marker"
                :active="screenStore.isShowMarker"
                @click="screenStore.toggleMarker()"/>
  </div>
</template>

<script setup lang="ts">
import IconButton from "./atom/IconButton.vue"
import {useScreenStore} from "../store/screen.store"

const screenStore = useScreenStore()

</script>

<style scoped>

</style>