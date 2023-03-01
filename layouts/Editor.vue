<template>
  <div class="flex flex-col | w-full h-screen">
    <Header/>
    <div class="flex | w-full h-full">
      <PagesPanel/>
      <Main>
        <slot/>
      </Main>
      <ConfigNodePanel/>
    </div>
    <Footer/>
  </div>
</template>

<script setup lang="ts">

import Header from "~/components/editor/Header.vue"
import Footer from "~/components/editor/Footer.vue"
import Main from "~/components/editor/Main.vue"
import PagesPanel from "~/components/editor/PagesPanel.vue"
import ConfigNodePanel from "~/components/editor/ConfigNodePanel.vue"</script>

<style scoped>

</style>