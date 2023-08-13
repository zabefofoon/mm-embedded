<template>
  <UiStyle>{{ generatedCss }}</UiStyle>
  <div class="tw-flex tw-flex-col | tw-relative | tw-w-full tw-h-screen | tw-overflow-hidden">
    <Header/>
    <div class="tw-flex | tw-w-full tw-h-full"
         style="max-height: calc(100vh - 40px);">
      <PagesPanel/>
      <main class="tw-w-full tw-h-full | tw-p-3 | tw-bg-slate-100">
        <div class="tw-flex tw-justify-center | tw-h-full">
          <iframe ref="canvas"
                  :style="{width: screenStore.screenSize.width, height: screenStore.screenSize.height}"
                  class="tw-w-full tw-h-full"
                  src="./#/canvas"
                  @load="initIframe">
          </iframe>
        </div>
      </main>
      <ConfigNodePanel/>
    </div>
    <ConfigWidgetLayer/>
  </div>
  <ModalsContainer/>

</template>

<script setup lang="ts">
import "../assets/style/basic.scss"
import Header from "../components/Header.vue"
import PagesPanel from "../components/PagesPanel.vue"
import ConfigNodePanel from "../components/ConfigNodePanel.vue"
import UiStyle from "../components/atom/Style.vue"
import ConfigWidgetLayer from "../components/ConfigWidgetLayer.vue"
import {useScreenStore} from "../store/screen.store"
import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue"
import {usePagesStore} from "../store/page.store"
import {useWidgetStore} from "../store/widget.store"
import {generateCss} from "../util/generateCss"
import {storeToRefs} from "pinia"
import {usePeerStore} from "../store/peer.store"
import {
  postCanvasPageMutation,
  postCanvasScreenMutation,
  postCanvasSelectUsingWidget
} from "../messenger/postToCanvas.msg"
import {receiveFromCanvas} from "../messenger/receiveFromCanvas.msg"
import {receiveFromProject} from "../messenger/receiveFromProject.msg"
import type {Item} from "../model/Widget"


const screenStore = useScreenStore()

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

const pageStore = usePagesStore()
const canvas = ref<HTMLIFrameElement>()

const peerStore = usePeerStore()

onBeforeMount(() => window.addEventListener('message', listenMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

const listenCanvasMessage = ($event: MessageEvent) => {

  const [type, data] = receiveFromCanvas($event)

  if (type === 'pageMutation') {
    if (data.pageData && data.pageData?.key !== pageStore.currentPage?.key) {
      pageStore.setPageData(data.pageData)
      pageStore.selectedNodeIds = data.selectedNodeIds || []
      screenStore.setScreenMode('size')
    }
  } else if (type === 'command') {
    if (data.command === 'removeNode')
      pageStore.removeNode()
    else if (data.command === 'addChildNode')
      pageStore.addChildNode()
    else if (data.command === 'addSiblingNodeDown')
      pageStore.addSiblingNodeDown()
    else if (data.command === 'copyNode')
      pageStore.copyNode()
    else if (data.command === 'cutNode')
      pageStore.cutNode()
    else if (data.command === 'pasteNode')
      pageStore.pasteNode()
    else if (data.command === 'undo')
      pageStore.actionManager.executeUndo()
    else if (data.command === 'redo')
      pageStore.actionManager.executeRedo()
  } else if (type === 'dragNode' && data.dragAction)
    pageStore.handleDragNode(data.dragAction)
}


const listenProjectMessage = ($event: MessageEvent) => {
  const [type, data] = receiveFromProject($event)
  if (type === 'loadData') {
    pageStore.loadPages(data.pages || [])
    widgetStore.setWidgetGroups(data.widgetGroups || [])
    pageStore.selectPage(pageStore.pages?.[0]?.id)
    setTimeout(() => {
      postCanvasPages()
      widgetStore.postWidgetStoreToCanvas()
      widgetStore.postWidgetGroupsToEditor()
    }, 100)
  } else if (type === 'connectedUser') {
    peerStore.setConnectedUsers($event.data.users)
  } else if (type === 'importWidgets') {
    const widgets: Item[] = $event.data?.widgets || []
    widgetStore.importWidgets(widgets)
    widgetStore.postWidgetGroupsToEditor()
    postCanvasPages()
    widgetStore.postWidgetStoreToCanvas()
  }
}
const listenMessage = ($event: MessageEvent) => {
  listenCanvasMessage($event)
  listenProjectMessage($event)
}

const initIframe = () => setTimeout(() => {
  widgetStore.setCanvas(canvas.value)
  postCanvasPages()
  widgetStore.postWidgetStoreToCanvas()
}, 250)

const postCanvasPages = () => {
  if (pageStore.circuitBreaker.status === 'off')
    postCanvasPageMutation(canvas.value,
        pageStore.pages,
        pageStore.selectedNodeIds,
        pageStore.currentPageId)
}

watch(() => pageStore.currentPage, postCanvasPages, {deep: true})

watch(() => [
      screenStore.isShowSpacing,
      screenStore.isShowOutline,
      screenStore.isShowHidden,
      screenStore.isShowMarker
    ],
    () => postCanvasScreenMutation(canvas.value,
        screenStore.isShowSpacing,
        screenStore.isShowOutline,
        screenStore.isShowHidden,
        screenStore.isShowMarker))

watch(() => widgetStore.selectedUsingWidgetId,
    (selectedUsingWidgetId) => postCanvasSelectUsingWidget(canvas.value, selectedUsingWidgetId))

const listenKeydown = ($event: KeyboardEvent) => {
  const isCtrl = $event.ctrlKey || $event.metaKey
  if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey)
    pageStore.actionManager.executeRedo()
  else if ($event.code === 'KeyZ' && isCtrl)
    pageStore.actionManager.executeUndo()
}

const generatedCss = computed(() => generateCss(pageStore.currentPage?.nodes || [], widgetGroups.value))

onMounted(() => window.addEventListener('keydown', listenKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', listenKeydown))

</script>

<style scoped>

</style>