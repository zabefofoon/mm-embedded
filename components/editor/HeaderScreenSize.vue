<template>
  <div class="flex justify-center gap-2">
    <IconButton icon="icon-screen-xl"
                @click="screenStore.setScreenSize('width', '100%')"
                :active="screenStore.screenSize.width === '100%'"/>
    <IconButton icon="icon-screen-l"
                @click="screenStore.setScreenSize('width', '75%')"
                :active="screenStore.screenSize.width === '75%'"/>
    <IconButton icon="icon-screen-m"
                @click="screenStore.setScreenSize('width', '50%')"
                :active="screenStore.screenSize.width === '50%'"/>
    <IconButton icon="icon-screen-s"
                @click="screenStore.setScreenSize('width', '33.33%')"
                :active="screenStore.screenSize.width === '33.33%'"/>
    <IconDivider/>
    <div class="flex items-center gap-3">
      <input class="w-20 | px-1 | border text-sm"
             placeholder="width"
             v-model="screenStore.screenSize.width"/>
      <span class="text-sm">x</span>
      <input class="w-20 | px-1 | border text-sm bg-slate-100"
             placeholder="height"
             v-model="screenStore.screenSize.height"
             disabled/>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "~/components/atom/IconButton.vue"
import IconDivider from "~/components/atom/IconDivider.vue"
import {useScreenStore} from "~/store/screen.store"

const screenStore = useScreenStore()

</script>

<style scoped lang="scss">

</style>