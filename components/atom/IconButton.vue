<template>
  <button class="px-1 | border border-slate-500 | flex items-center"
          :class="[{'bg-slate-500': active}, {'text-white': active}]">
    <i class="icon text-2xl"
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