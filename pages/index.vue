<template>
  <div class="h-full p-3">
    <MainCanvas/>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from "#imports"
import MainCanvas from "~/components/editor/MainCanvas.vue"

definePageMeta({
  layout: 'editor'
})
</script>

<style scoped>

</style>