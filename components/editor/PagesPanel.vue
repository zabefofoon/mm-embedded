<template>
  <aside class="w-80 | border-r | p-3">
    <button class="text-slate-500">
      <i class="icon icon-add"></i>
    </button>
    <hr class="my-1"/>
    <ul class="flex flex-col gap-2">
      <li v-for="(page, index) in pages"
          :key="page.name + index"
          class="page-list | flex items-center">
        <button class="w-full | flex items-center gap-1 | text-sm text-left text-gray-400"
                :class="[{'text-slate-500': page.name === 'page-1'}, {'font-bold': page.name === 'page-1'}]">
          <i class="icon icon-page"></i>
          {{ page.name }}
        </button>
        <button class="delete-button | text-sm text-slate-500">
          <i class="icon icon-delete"></i>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {ref} from "#imports"

const pages = ref([{name: 'page-1'}, {name: 'page-2'}, {name: 'page-3'}])
</script>

<style scoped lang="scss">
.delete-button {
  display: none;
}

.page-list:hover .delete-button {
  display: inline-block;
}
</style>