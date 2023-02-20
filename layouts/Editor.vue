<template>
  <div class="flex flex-col | w-full h-screen">
    <Header/>
    <div class="flex | w-full h-full">
      <AsideLeft/>
      <Main>
        <slot/>
      </Main>
      <AsideRight/>
    </div>
    <Footer/>
  </div>
</template>

<script setup lang="ts">

import Header from "~/components/editor/Header.vue"
import Footer from "~/components/editor/Footer.vue"
import Main from "~/components/editor/Main.vue"
import AsideLeft from "~/components/editor/AsideLeft.vue"
import AsideRight from "~/components/editor/AsideRight.vue"</script>

<style scoped>

</style>