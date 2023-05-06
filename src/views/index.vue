<template>
  <UiStyle>{{ generatedCss }}</UiStyle>
  <div class="flex flex-col | relative | w-full h-screen | overflow-hidden">
    <Header/>
    <div class="flex | w-full h-full"
         style="max-height: calc(100vh - 40px);">
      <PagesPanel/>
      <main class="w-full h-full | p-3 | bg-slate-100">
        <div class="flex justify-center | h-full">
          <iframe ref="canvas"
                  :style="{width: screenStore.screenSize.width, height: screenStore.screenSize.height}"
                  class="w-full h-full"
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
import type {PageData} from "../store/page.store"
import {usePagesStore} from "../store/page.store"
import {deepClone} from "../util/util"
import {useWidgetStore} from "../store/widget.store"
import {generateCss} from "../util/generateCss"
import {storeToRefs} from "pinia"
import {usePeerStore} from "../store/peer.store"

const screenStore = useScreenStore()

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

const pageStore = usePagesStore()
const canvas = ref<HTMLIFrameElement>()

const peerStore = usePeerStore()

onBeforeMount(() => window.addEventListener('message', listenMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

const listenMessage = ($event: MessageEvent) => {
  if ($event.data.type === 'pageMutation') {
    const pageData = <PageData>$event.data.data
    if (pageData?.key !== pageStore.currentPage?.key)
      pageStore.setPageData(pageData)
  } else if ($event.data.type === 'command') {
    if ($event.data.data === 'removeNode')
      pageStore.removeNode()
    else if ($event.data.data === 'addChildNode')
      pageStore.addChildNode()
    else if ($event.data.data === 'addSiblingNodeDown')
      pageStore.addSiblingNodeDown()
    else if ($event.data.data === 'copyNode')
      pageStore.copyNode()
    else if ($event.data.data === 'cutNode')
      pageStore.cutNode()
    else if ($event.data.data === 'pasteNode')
      pageStore.pasteNode()
    else if ($event.data.data === 'undo')
      pageStore.actionManager.executeUndo()
    else if ($event.data.data === 'redo')
      pageStore.actionManager.executeRedo()
  } else if ($event.data.type === 'loadData') {
    pageStore.loadPages($event.data.data?.pages || [])
    widgetStore.setWidgetGroups($event.data.data?.widgetGroups || [])
    pageStore.selectPage(pageStore.pages?.[0].id)
    setTimeout(() => {
      postPages()
      widgetStore.postWidgetStoreToCanvas()
      widgetStore.postWidgetGroupsToEditor()
    }, 100)
  } else if ($event.data.type === 'connectedUser') {
    peerStore.setConnectedUsers($event.data.data)
  } else if ($event.data.type === 'realTimeEdit') {
    if (pageStore.circuitBreaker.status === 'off') {
      pageStore.loadPages($event.data.data?.pages || [])
      widgetStore.setWidgetGroups($event.data.data?.widgetGroups || [])
      postPages()
      widgetStore.postWidgetStoreToCanvas()
    }
  } else if ($event.data.type === 'realTimeWidgetGroups') {
    widgetStore.setWidgetGroups($event.data.data?.widgetGroups || [])
    widgetStore.postWidgetGroupsToEditor()
    postPages()
    widgetStore.postWidgetStoreToCanvas()
  }
}

const initIframe = () => setTimeout(() => {
  widgetStore.setCanvas(canvas.value)
  postPages()
  widgetStore.postWidgetStoreToCanvas()
}, 250)

const postPages = () => {
  if (pageStore.circuitBreaker.status === 'off')
    canvas.value
        ?.contentWindow
        ?.postMessage({
          type: 'pagesMutation',
          data: {
            pages: deepClone(pageStore.pages),
            currentPageId: pageStore.currentPageId
          }
        })
}

const postScreenData = (isShowSpacing: boolean,
                        isShowOutline: boolean,
                        isShowHidden: boolean,
                        isShowMarker: boolean) => {
  canvas.value?.contentWindow?.postMessage({
    type: 'screenMutation',
    data: deepClone({isShowSpacing, isShowOutline, isShowHidden, isShowMarker})
  })
}

watch(() => pageStore.currentPage, postPages, {deep: true})

watch(() => [
      screenStore.isShowSpacing,
      screenStore.isShowOutline,
      screenStore.isShowHidden,
      screenStore.isShowMarker
    ],
    () => postScreenData(screenStore.isShowSpacing,
        screenStore.isShowOutline,
        screenStore.isShowHidden,
        screenStore.isShowMarker))

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