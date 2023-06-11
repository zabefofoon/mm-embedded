<template>
  <div class="tw-w-full tw-h-screen | tw-absolute tw-top-0 tw-z-1 | tw-flex tw-flex-col | tw-bg-white | tw-transition-all"
       :class="widgetStore.isLayerShow ? 'tw-left-0' : 'tw-left-full'">
    <HeaderGoWidgetsButton class="tw-absolute tw-top-1 tw-right-0"/>
    <HeaderGoWidgetsButton class="tw-absolute tw-top-1 tw-left-0 tw--translate-x-full"/>
    <iframe class="tw-w-full tw-h-full"
            src="https://zabefofoon.github.io/dsm-embbedded?save=true"
            allow="clipboard-read; clipboard-write"
            @load="widgetStore.setWidgetEditor($event.target)"></iframe>
  </div>
</template>

<script setup lang="ts">
import {useWidgetStore} from "../store/widget.store"
import HeaderGoWidgetsButton from "../components/HeaderGoWidgetsButton.vue"
import {onBeforeUnmount, onMounted} from "vue"
import {deepClone} from "../util/util"
import {usePagesStore} from "../store/page.store"

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

onMounted(() => window.addEventListener('message', updateProjectDetail))
onBeforeUnmount(() => window.removeEventListener('message', updateProjectDetail))

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
  } else if (event.data.type === 'editRealtime') {
    widgetStore.setWidgetGroups(JSON.parse(event.data.groups))
    window.parent
        ?.postMessage({
          type: 'editWidgetGroupsRealtime',
          data: {
            widgetGroups: deepClone(widgetStore.widgetGroups),
          }
        }, '*')
  }
}

//watch(widgetGroups, postGroups, {immediate: true})
</script>

<style scoped>

</style>