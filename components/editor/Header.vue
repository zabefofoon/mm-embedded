<template>
  <header class="border-b | flex items-center gap-2 | pl-4 py-2">
    <IconButton icon="icon-screen-size"
                :active="true"/>
    <IconDivider/>
    <HeaderScreenSize/>
  </header>
</template>

<script setup lang="ts">
import HeaderScreenSize from "~/components/editor/HeaderScreenSize.vue"
import IconButton from "~/components/atom/IconButton.vue"
import IconDivider from "~/components/atom/IconDivider.vue"</script>

<style scoped>

</style>