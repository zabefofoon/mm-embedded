<template>
  <div class="flex justify-center gap-2">
    <IconButton icon="icon-spacing"
                :active="screenStore.isShowSpacing"
                @click="screenStore.toggleShowSpacing()"/>
    <IconButton icon="icon-outline"
                :active="screenStore.isShowOutline"
                @click="screenStore.toggleShowOutline()"/>
    <IconButton icon="icon-hidden"
                :active="screenStore.isShowHidden"
                @click="screenStore.toggleShowHidden()"/>
    <IconButton icon="icon-marker"
                :active="screenStore.isShowMarker"
                @click="screenStore.toggleMarker()"/>
  </div>
</template>

<script setup lang="ts">
import IconButton from "~/components/atom/IconButton.vue"
import {useScreenStore} from "~/store/screen.store"

const screenStore = useScreenStore()

</script>

<style scoped>

</style>