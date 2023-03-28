<template>
  <button class="flex items-center | px-1 | text-slate-500 border border-slate-500 hover:bg-slate-200"
          :class="[{'bg-slate-500': active}, {'text-white': active}]">
    <i class="icon text-xl"
       :class="icon"></i>
  </button>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">

</style>