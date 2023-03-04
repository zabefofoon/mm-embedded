<template>
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
</template>

<script setup lang="ts">
import {PageData, usePagesStore} from "~/store/page.store"
import {onBeforeMount, onBeforeUnmount, ref, watch} from "#imports"
import {deepClone} from "~/util/util"
import {ClientOnly} from "#components"
import {useWidgetStore} from "~/store/widget.store"
import {useScreenStore} from "~/store/screen.store"

const screenStore = useScreenStore()

const widgetStore = useWidgetStore()

const pageStore = usePagesStore()
const canvas = ref<HTMLIFrameElement>()

onBeforeMount(() => window.addEventListener('message', listenMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

const listenMessage = ($event: MessageEvent) => {
  if ($event.data.type !== 'pageMutation') return

  const pageData = <PageData>$event.data.data
  if (pageData.key !== pageStore.pageData.key)
    pageStore.setPageData($event.data.data)
}

const initIframe = () => setTimeout(() => {
  widgetStore.setCanvas(canvas.value)
  postPageData(pageStore.pageData)
}, 250)

const postPageData = (pageData: PageData) => {
  canvas.value?.contentWindow?.postMessage({
    type: 'pageMutation',
    data: deepClone(pageData)
  })
}

const postScreenData = (isShowSpacing: boolean,
                        isShowOutline: boolean,
                        isShowHidden: boolean) => {
  canvas.value?.contentWindow?.postMessage({
    type: 'screenMutation',
    data: deepClone({isShowSpacing, isShowOutline, isShowHidden})
  })
}

watch(() => pageStore.pageData,
    postPageData,
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

<style scoped lang="scss">

</style>