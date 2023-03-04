<template>
  <header class="border-b | flex items-center gap-2 | pl-4 py-2">
    <IconButton icon="icon-screen-size"
                :active="screenStore.screenMode === 'size'"
                @click="screenStore.setScreenMode('size')"/>
    <IconButton icon="icon-eye"
                :active="screenStore.screenMode === 'view'"
                @click="screenStore.setScreenMode('view')"/>
    <IconDivider/>
    <HeaderScreenSize v-if="screenStore.screenMode === 'size'"/>
    <HeaderScreenView v-else-if="screenStore.screenMode === 'view'"/>
  </header>
</template>

<script setup lang="ts">
import HeaderScreenSize from "~/components/editor/HeaderScreenSize.vue"
import HeaderScreenView from "~/components/editor/HeaderScreenView.vue"
import IconButton from "~/components/atom/IconButton.vue"
import IconDivider from "~/components/atom/IconDivider.vue"
import {useScreenStore} from "~/store/screen.store"

const screenStore = useScreenStore()

</script>

<style scoped>

</style>