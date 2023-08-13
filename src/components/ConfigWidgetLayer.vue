<template>
  <div class="tw-w-full tw-h-screen | tw-absolute tw-top-0 tw-z-1 | tw-flex tw-flex-col | tw-bg-white | tw-transition-all"
       :class="widgetStore.isLayerShow ? 'tw-left-0' : 'tw-left-full'">
    <HeaderGoWidgetsButton class="tw-absolute tw-top-1 tw-right-0"/>
    <HeaderGoWidgetsButton class="tw-absolute tw-top-1 tw-left-0 tw--translate-x-full"/>
    <iframe class="tw-w-full tw-h-full"
            src="https://zabefofoon.github.io/dsm-embbedded/?edit=true"
            allow="clipboard-read; clipboard-write"
            @load="widgetStore.setWidgetEditor($event.target)"></iframe>
  </div>
</template>

<script setup lang="ts">
import {useWidgetStore} from "../store/widget.store"
import HeaderGoWidgetsButton from "../components/HeaderGoWidgetsButton.vue"
import {onBeforeUnmount, onMounted} from "vue"
import {usePagesStore} from "../store/page.store"
import {postProjectSaveProject, postProjectWidgetGroupsMutation} from "../messenger/postToProject.msg"
import {receiveFromWidgetLayer} from "../messenger/receiveFromWidgetLayer"

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

onMounted(() => window.addEventListener('message', listenWidgetLayerMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenWidgetLayerMessage))

const listenWidgetLayerMessage = (event: MessageEvent) => {
  const [type, data] = receiveFromWidgetLayer(event)
  if (type === 'saveGroups') {
    widgetStore.setWidgetGroups(data.groups || [])
    postProjectSaveProject(pageStore.pages, widgetStore.widgetGroups)
    alert('save the project')
  }

  if (type === 'groupsMutation') {
    widgetStore.setWidgetGroups(data.groups || [])
    postProjectWidgetGroupsMutation(widgetStore.widgetGroups)
  }
}
</script>

<style scoped>

</style>