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
import {definePageMeta, onBeforeMount, onBeforeUnmount, ref, watch} from "#imports"
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
  if ($event.data.type !== 'pageMutation') return

  const pageData = <PageData>$event.data.data
  if (pageData?.key !== pageStore.currentPage?.key)
    pageStore.setPageData(pageData)
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

</script>

<style scoped>

</style>