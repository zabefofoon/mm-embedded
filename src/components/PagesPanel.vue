<template>
  <aside class="tw-w-80 | tw-border-r | tw-p-3">
    <div class="tw-flex tw-items-center tw-gap-1">
      <button class="tw-flex tw-items-center | tw-text-slate-500"
              @click="pageStore.addPage()">
        <i class="mm-icon mm-icon-add"></i>
      </button>
      <button v-if="pageStore.currentPageId"
              class="tw-flex tw-items-center | tw-text-slate-500"
              @click="pageStore.removePage()">
        <i class="mm-icon mm-icon-minus"></i>
      </button>
      <div class="tw-h-4 | tw-mx-1 | tw-border-r tw-border-slate-300"></div>
      <button v-if="pageStore.currentPageId"
              class="tw-flex tw-items-center | tw-text-slate-500"
              @click="pageStore.copyPage()">
        <i class="mm-icon mm-icon-copy"></i>
      </button>
      <div class="tw-h-4 | tw-mx-1 | tw-border-r tw-border-slate-300"></div>
      <button v-if="pageStore.currentPageId"
              class="tw-flex tw-items-center | tw-text-slate-500"
              @click="pageStore.moveUpPage()">
        <i class="mm-icon mm-icon-arrow-top"></i>
      </button>
      <button v-if="pageStore.currentPageId"
              class="tw-flex tw-items-center | tw-text-slate-500"
              @click="pageStore.moveDownPage()">
        <i class="mm-icon mm-icon-arrow-bottom"></i>
      </button>
    </div>
    <hr class="tw-my-1"/>
    <ul class="tw-flex tw-flex-col tw-gap-2">
      <li v-for="(page) in pageStore.pages"
          :key="page.id"
          class="page-list | tw-flex tw-items-center">
        <button class="w-full | tw-flex tw-items-center tw-gap-1 | tw-text-sm tw-text-left tw-text-gray-400"
                :class="[{'tw-text-slate-500': page.id === pageStore.currentPageId}, {'tw-font-bold': page.id === pageStore.currentPageId}]"
                @click="pageStore.selectPage(page.id)">
          <i class="mm-icon mm-icon-page"></i>
          <input class="tw-px-1 | tw-w-full"
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