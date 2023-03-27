<template>
  <aside class="w-80 | border-r | p-3">
    <div class="flex items-center gap-1">
      <button class="flex items-center | text-slate-500"
              @click="pageStore.addPage()">
        <i class="icon icon-add"></i>
      </button>
      <button v-if="pageStore.currentPageId"
              class="flex items-center | text-slate-500"
              @click="pageStore.removePage()">
        <i class="icon icon-minus"></i>
      </button>
      <div class="h-4 | mx-1 | border-r border-slate-300"></div>
      <button v-if="pageStore.currentPageId"
              class="flex items-center | text-slate-500"
              @click="pageStore.copyPage()">
        <i class="icon icon-copy"></i>
      </button>
      <div class="h-4 | mx-1 | border-r border-slate-300"></div>
      <button v-if="pageStore.currentPageId"
              class="flex items-center | text-slate-500"
              @click="pageStore.moveUpPage()">
        <i class="icon icon-arrow-top"></i>
      </button>
      <button v-if="pageStore.currentPageId"
              class="flex items-center | text-slate-500"
              @click="pageStore.moveDownPage()">
        <i class="icon icon-arrow-bottom"></i>
      </button>
    </div>
    <hr class="my-1"/>
    <ul class="flex flex-col gap-2">
      <li v-for="(page) in pageStore.pages"
          :key="page.id"
          class="page-list | flex items-center">
        <button class="w-full | flex items-center gap-1 | text-sm text-left text-gray-400"
                :class="[{'text-slate-500': page.id === pageStore.currentPageId}, {'font-bold': page.id === pageStore.currentPageId}]"
                @click="pageStore.selectPage(page.id)">
          <i class="icon icon-page"></i>
          <input class="px-1 | w-full"
                 v-model="page.name"/>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"

const pageStore = usePagesStore()
</script>

<style scoped>

</style>