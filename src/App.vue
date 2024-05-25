<template>
  <div
    v-if="detectedAdBlocker"
    class="tw-fixed tw-top-0 tw-left-0 tw-z-10 | tw-w-screen tw-h-screen | tw-bg-white | tw-flex tw-items-center tw-justify-center">
    Please disable the ad blocker.
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import 'vue-final-modal/style.css'

const detectedAdBlocker = ref(false)
const detectAdBlocker = (value: boolean) => (detectedAdBlocker.value = value)

setTimeout(function () {
  fetch('https://www3.doubleclick.net', {
    method: 'HEAD',
    mode: 'no-cors',
    cache: 'no-store'
  }).catch(() => detectAdBlocker(true))
}, 1000)
</script>

<style scoped></style>
