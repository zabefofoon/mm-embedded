<template>
  <div class="h-full">
    <ClientOnly>
      <iframe ref="canvas"
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

const initIframe = () => setTimeout(() => postPageData(pageStore.pageData), 250)

const postPageData = (pageData: PageData) => {
  canvas.value?.contentWindow?.postMessage({
    type: 'pageMutation',
    data: deepClone(pageData)
  })
}

watch(() => pageStore.pageData,
    postPageData,
    {deep: true})


</script>

<style scoped lang="scss">

</style>