<template>
  <div class="w-full h-screen | absolute top-0 z-1 | flex flex-col | bg-white | transition-all"
       :class="widgetStore.isLayerShow ? 'left-0' : 'left-full'">
    <HeaderGoWidgetsButton class="absolute top-1 right-0"/>
    <HeaderGoWidgetsButton class="absolute top-1 left-0 -translate-x-full"/>
    <iframe ref="iframe"
            class="w-full h-full"
            src="https://zabefofoon.github.io/dsm-embbedded?save=true"
            allow="clipboard-read; clipboard-write"
            @load="postGroups"></iframe>
  </div>
</template>

<script setup lang="ts">
import {useWidgetStore} from "../store/widget.store"
import HeaderGoWidgetsButton from "../components/HeaderGoWidgetsButton.vue"
import {onBeforeUnmount, onMounted, ref, watch} from "vue"
import {storeToRefs} from "pinia"
import {deepClone} from "../util/util"
import {usePagesStore} from "../store/page.store"

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

onMounted(() =>window.addEventListener('message', updateProjectDetail))
onBeforeUnmount(() => window.removeEventListener('message', updateProjectDetail))

const iframe = ref<HTMLIFrameElement>()
const postGroups = () => setTimeout(() => iframe.value
    ?.contentWindow
    ?.postMessage({
      type: 'loadGroups',
      groups: deepClone(widgetGroups.value)
    }, '*'))


const updateProjectDetail = (event: MessageEvent) => {
  if (event.data.type === 'saveGroups') {
    widgetStore.setWidgetGroups(JSON.parse(event.data.groups))
    window.parent
        ?.postMessage({
          type: 'saveProject',
          data: {
            pages: deepClone(pageStore.pages),
            widgetGroups: deepClone(widgetStore.widgetGroups),
          }
        }, '*')
    alert('save the project')
  }
}

watch(widgetGroups, postGroups, {immediate: true})
</script>

<style scoped>

</style>