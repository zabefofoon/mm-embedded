<template>
  <div class="h-full p-3">
    <div class="flex justify-center | h-full">
      <ClientOnly>
        <iframe ref="canvas"
                :style="{width: screenStore.screenSize.width, height: screenStore.screenSize.height}"
                class="w-full h-full"
                src="./canvas"
                @load="initIframe">
        </iframe>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta, onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "#imports"
import {useScreenStore} from "~/store/screen.store"
import {useWidgetStore} from "~/store/widget.store"
import {PageData, usePagesStore} from "~/store/page.store"
import {deepClone} from "~/util/util"
import {ClientOnly} from "#components"

definePageMeta({
  layout: 'editor'
})

const screenStore = useScreenStore()

const widgetStore = useWidgetStore()

const pageStore = usePagesStore()
const canvas = ref<HTMLIFrameElement>()

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

  }
}

const initIframe = () => setTimeout(() => {
  widgetStore.setCanvas(canvas.value)
  postPages()
}, 250)

const postPages = () => canvas.value
    ?.contentWindow
    ?.postMessage({
      type: 'pagesMutation',
      data: {
        pages: deepClone(pageStore.pages),
        currentPageId: pageStore.currentPageId
      }
    })

const postScreenData = (isShowSpacing: boolean,
                        isShowOutline: boolean,
                        isShowHidden: boolean) => {
  canvas.value?.contentWindow?.postMessage({
    type: 'screenMutation',
    data: deepClone({isShowSpacing, isShowOutline, isShowHidden})
  })
}

watch(() => pageStore.currentPage,
    postPages,
    {deep: true})

watch(() => [
      screenStore.isShowSpacing,
      screenStore.isShowOutline,
      screenStore.isShowHidden
    ],
    () => postScreenData(screenStore.isShowSpacing,
        screenStore.isShowOutline,
        screenStore.isShowHidden))

const listenKeydown = ($event: KeyboardEvent) => {
  const isCtrl = $event.ctrlKey || $event.metaKey
  if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey)
    pageStore.actionManager.executeRedo()
  else if ($event.code === 'KeyZ' && isCtrl)
    pageStore.actionManager.executeUndo()
}

onMounted(() => {
  window.addEventListener('keydown', listenKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', listenKeydown)
})
</script>

<style scoped>

</style>