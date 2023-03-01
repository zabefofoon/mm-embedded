<template>
  <div class="bg-white shadow-md | min-h-screen"
       @click="pageStore.selectNodeOne()">
    <UiStyle>{{ generatedCss }}</UiStyle>
    <Node v-for="node in pageStore.pageData.nodes"
          :key="node.id"
          :node="node"/>
  </div>
</template>

<script setup lang="ts">
import {PageData, usePagesStore} from "~/store/page.store"
import {computed, onBeforeMount, onBeforeUnmount, watch} from "#imports"
import {deepClone} from "~/util/util"
import UiStyle from "~/components/atom/UiStyle.vue"
import Node from "~/components/editor/Node.vue"
import {generateCss} from "~/util/generateCss"
import {Group, useWidgetStore} from "~/store/widget.store"
import {storeToRefs} from "pinia"

onBeforeMount(() => window.addEventListener('message', listenMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

const listenMessage = ($event: MessageEvent) => {
  if ($event.data.type === 'pageMutation') {
    const pageData = <PageData>$event.data.data
    if (pageData.key !== pageStore.pageData.key)
      pageStore.setPageData(pageData)
  }

  if ($event.data.type === 'widgetGroupsMutation') {
    const groups = <Group[]>$event.data.data
    widgetStore.setWidgetGroups(groups)
  }
}

const pageStore = usePagesStore()
const postPageData = (pageData: PageData) => {
  window.parent?.postMessage({
    type: 'pageMutation',
    data: deepClone(pageData)
  })
}

watch(() => pageStore.pageData,
    postPageData,
    {deep: true})

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

const generatedCss = computed(() => generateCss(pageStore.pageData.nodes, widgetGroups.value))
</script>

<style scoped lang="scss">

</style>