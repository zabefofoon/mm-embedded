<template>
  <div class="flex justify-center gap-2">
    <IconButton icon="icon-screen-xl"
                active/>
    <IconButton icon="icon-screen-l"/>
    <IconButton icon="icon-screen-m"/>
    <IconButton icon="icon-screen-s"/>
    <IconDivider/>
    <div class="flex items-center gap-3">
      <input class="w-20 | px-1 | border text-sm"
             value="100%"
             placeholder="width"/>
      <span class="text-sm">x</span>
      <input class="w-20 | px-1 | border text-sm"
             value="100%"
             placeholder="height"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import IconButton from "~/components/atom/IconButton.vue"
import IconDivider from "~/components/atom/IconDivider.vue"</script>

<style scoped lang="scss">

</style>