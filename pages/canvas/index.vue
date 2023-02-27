<template>
  <div class="bg-white shadow-md | min-h-screen | overflow-auto"
       @click="pageStore.selectNodeOne()">
    <UiStyle>{{ generatedCss }}</UiStyle>
    <Node v-for="node in pageStore.pageData.nodes"
          :key="node.id"
          :node="node"/>
  </div>
</template>

<script setup lang="ts">
import {Node as NodeType, PageData, ResponsiveMode, usePagesStore} from "~/store/page.store"
import {computed, onBeforeMount, onBeforeUnmount, watch} from "#imports"
import {deepClone} from "~/util/util"
import UiStyle from "~/components/atom/UiStyle.vue"
import Node from "~/components/editor/Node.vue"

onBeforeMount(() => window.addEventListener('message', listenMessage))
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

const listenMessage = ($event: MessageEvent) => {
  if ($event.data.type !== 'pageMutation') return

  const pageData = <PageData>$event.data.data
  if (pageData.key !== pageStore.pageData.key)
    pageStore.setPageData(pageData)
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

const generatedCss = computed(() => {
  return generateCoreCss() + `\n` + generateCss()
})

const generateGap = (node: NodeType,
                     acc: string,
                     responsiveMode: ResponsiveMode) => {
  const screenSize = responsiveMode === 'small' ? '0px' : '768px'
  return node.layout[responsiveMode].gap
  && !acc.includes(`.${responsiveMode}\\:gap-${node.layout[responsiveMode].gap}`)
      ? `
@media(min-width: ${screenSize}) {
  .${responsiveMode}\\:gap-${node.layout[responsiveMode].gap} {
    gap: ${node.layout[responsiveMode].gap}px;
  }
}
`
      : ''
}

const generateColumns = (node: NodeType,
                         acc: string,
                         responsiveMode: ResponsiveMode) => {
  const screenSize = responsiveMode === 'small' ? '0px' : '768px'
  return node.layout[responsiveMode].columns
  && !acc.includes(`.${responsiveMode}\\:columns-${node.layout[responsiveMode].columns}`)
      ? `
@media(min-width: ${screenSize}) {
  .${responsiveMode}\\:columns-${node.layout[responsiveMode].columns} {
    grid-template-columns: repeat(${node.layout[responsiveMode].columns}, 1fr);
  }
}
`
      : ''
}

const generateCss = () => {
  return pageStore.pageData.nodes.reduce((acc, current) => {
    const smallGap = generateGap(current, acc, 'small')
    const largeGap = generateGap(current, acc, 'large')
    const smallColumns = generateColumns(current, acc, 'small')
    const largeColumns = generateColumns(current, acc, 'large')

    return acc + smallGap + largeGap + smallColumns + largeColumns
  }, '')
}

const generateCoreCss = () => {
  return `
.node {
  width: 100%;
  border-collapse: collapse;
}

@media (min-width: 0) {
  .small\\:type-stack {
      display: flex;
  }

  .small\\:direction-horizontal {
      flex-direction: row;
  }

  .small\\:direction-vertical {
      flex-direction: column;
  }

  .small\\:type-grid {
      display: grid;
  }
}


@media (min-width: 768px) {
  .large\\:type-stack {
      display: flex
  }

  .large\\:direction-horizontal {
      flex-direction: row;
  }

  .large\\:direction-vertical {
      flex-direction: column;
  }

  .large\\:type-grid {
      display: grid;
  }
}
`
}
</script>

<style scoped lang="scss">

</style>