<template>
  <div class="bg-white shadow-md | min-h-screen"
       @click="pageStore.selectNodeOne()">
    <UiStyle>{{ generatedCss }}</UiStyle>
    <Node v-for="node in pageStore.currentPage?.nodes"
          :key="node.id"
          :node="node"/>
  </div>
</template>

<script setup lang="ts">
import {PageData, usePagesStore} from "../store/page.store"
import {computed, onBeforeMount, onBeforeUnmount, onMounted, watch} from "vue"
import {deepClone} from "../util/util"
import UiStyle from "../components/atom/Style.vue"
import Node from "../components/Node.vue"
import {generateCss} from "../util/generateCss"
import {useWidgetStore} from "../store/widget.store"
import {storeToRefs} from "pinia"
import {useScreenStore} from "../store/screen.store"
import {Group} from "../model/Widget"

onMounted(() => {
  window.addEventListener('message', listenMessage)
  window.addEventListener('keydown', listenKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', listenMessage)
  window.removeEventListener('keydown', listenKeydown)
})

const listenKeydown = ($event: KeyboardEvent) => {
  const isCtrl = $event.ctrlKey || $event.metaKey
  if ($event.code === 'Delete' || $event.code === 'Backspace')
    postCommand('removeNode')
  else if ($event.code === 'Enter' && isCtrl)
    postCommand('addChildNode')
  else if ($event.code === 'Enter')
    postCommand('addSiblingNodeDown')
  else if ($event.code === 'KeyC')
    postCommand('copyNode')
  else if ($event.code === 'KeyX')
    postCommand('cutNode')
  else if ($event.code === 'KeyV')
    postCommand('pasteNode')
  else if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey)
    postCommand('redo')
  else if ($event.code === 'KeyZ' && isCtrl)
    postCommand('undo')
}

const listenMessage = ($event: MessageEvent) => {
  if ($event.data.type === 'pagesMutation') {
    const data = <{ pages: PageData[], currentPageId: string }>$event.data.data
    pageStore.loadPages(data.pages)
    pageStore.selectPage(data.currentPageId)
  } else if ($event.data.type === 'widgetGroupsMutation') {
    const groups = <Group[]>$event.data.data
    widgetStore.setWidgetGroups(groups)
  } else if ($event.data.type === 'screenMutation') {
    const {isShowSpacing, isShowOutline, isShowHidden, isShowMarker} = <{ [key in string]: boolean }>$event.data.data
    screenStore.toggleShowSpacing(isShowSpacing)
    screenStore.toggleShowOutline(isShowOutline)
    screenStore.toggleShowHidden(isShowHidden)
    screenStore.toggleMarker(isShowMarker)
  }
}

const postCommand = (command: string) => window.parent
    ?.postMessage({
      type: 'command',
      data: command
    })

const screenStore = useScreenStore()
const {isShowHidden} = storeToRefs(screenStore)

const pageStore = usePagesStore()
const postPageData = (pageData: PageData) => window.parent
    ?.postMessage({
      type: 'pageMutation',
      data: deepClone(pageData)
    })

watch(() => pageStore.currentPage,
    postPageData,
    {deep: true})

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

const generatedCss = computed(() => generateCss(pageStore.currentPage?.nodes, widgetGroups.value, isShowHidden.value))
</script>

<style scoped lang="scss">

</style>