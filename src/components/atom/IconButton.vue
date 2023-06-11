<template>
  <button class="tw-flex tw-items-center | tw-px-1 | tw-text-slate-500 tw-border tw-border-slate-500 hover:tw-bg-slate-200"
          :class="[{'tw-bg-slate-500': active}, {'tw-text-white': active}]">
    <i class="mm-icon tw-text-xl"
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