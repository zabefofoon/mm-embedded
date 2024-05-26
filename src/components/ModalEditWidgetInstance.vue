<template>
  <VueFinalModal
    v-bind="$attrs"
    class="mm-modal-container"
    content-class="mm-modal-content | tw-w-3/5 tw-h-4/5 tw-max-w-[600px]">
    <span class="mm-modal__title | tw-flex tw-items-center">
      <span class="tw-text-slate-500">Edit Widget Instance</span>
      <button
        class="tw-flex tw-items-center | tw-ml-auto | tw-text-slate-500"
        @click="emit('close')">
        <i class="mm-icon mm-icon-close"></i>
      </button>
    </span>
    <div class="mm-modal__content | tw-px-2">
      <div class="tw-flex tw-flex-col tw-gap-16 | tw-h-full">
        <textarea
          v-if="node?.widget"
          class="tw-h-full | tw-border"
          v-model="html"
          @keydown.stop></textarea>
      </div>
    </div>
    <div class="mm-modal__action">
      <button
        class="tw-px-8 tw-py-1 | tw-bg-blue-500 | tw-text-white | tw-rounded-full"
        @click="saveInstance">
        Save
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { usePagesStore } from '../store/page.store'
import prettyHtml from 'pretty'

const props = defineProps<{
  nodeId: string
}>()

const pageStore = usePagesStore()

const html = ref('')

const emit = defineEmits(['select', 'close'])
const node = computed(() => pageStore.findNode(props.nodeId))

const saveInstance = () => {
  pageStore.setWidgetInstance(props.nodeId, html.value)
  emit('close')
}

onMounted(() => {
  html.value = prettyHtml(
    node.value?.widget?.instance || node.value?.widget?.html || ''
  )
})
</script>

<style scoped></style>
