<template>
  <div
    class="tw-bg-white tw-shadow-md | tw-min-h-screen"
    @click="pageStore.selectNodeOne()">
    <UiStyle>{{ generatedCss }}</UiStyle>
    <draggable
      v-bind="dragOptions"
      :list="pageStore.currentPage?.nodes"
      @start="startHandler"
      @end="endHandler">
      <NodeEl
        v-for="node in pageStore.currentPage?.nodes"
        :key="node.id"
        :node="node"
        @db-click="dbClickHandler" />
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import NodeEl from '../components/Node.vue'
import UiStyle from '../components/atom/Style.vue'
import {
  postEditorAddWidget,
  postEditorCommand,
  postEditorPageMutation,
  postEditorChangeEditWidgetMode
} from '../messenger/postToEditor.msg'
import { receiveFromEditor } from '../messenger/receiveFromEditor.msg'
import type { Page } from '../model/Page'
import { usePagesStore } from '../store/page.store'
import { useScreenStore } from '../store/screen.store'
import { useWidgetStore } from '../store/widget.store'
import { generateCss, generateDragAreaCss } from '../util/generateCss'

const widgetStore = useWidgetStore()
const screenStore = useScreenStore()
const pageStore = usePagesStore()

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
    postEditorCommand('removeNode')
  else if ($event.code === 'Enter' && isCtrl) postEditorCommand('addChildNode')
  else if ($event.code === 'Enter') postEditorCommand('addSiblingNodeDown')
  else if ($event.code === 'KeyC') postEditorCommand('copyNode')
  else if ($event.code === 'KeyX') postEditorCommand('cutNode')
  else if ($event.code === 'KeyV') postEditorCommand('pasteNode')
  else if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey)
    postEditorCommand('redo')
  else if ($event.code === 'KeyZ' && isCtrl) postEditorCommand('undo')
  else if ($event.code === 'ArrowUp' && isCtrl)
    postEditorCommand('selectParentNode')
  else if ($event.code === 'ArrowUp') postEditorCommand('selectPrevSiblingNode')
  else if ($event.code === 'ArrowUp') postEditorCommand('selectPrevSiblingNode')
  else if ($event.code === 'ArrowDown' && isCtrl)
    postEditorCommand('selectChildNode')
  else if ($event.code === 'ArrowDown')
    postEditorCommand('selectNextSiblingNode')
}

const listenMessage = ($event: MessageEvent) => {
  const [type, data] = receiveFromEditor($event)
  if (type === 'pagesMutation') {
    pageStore.loadPages(data.pages || [])
    pageStore.selectPage(data.currentPageId)
    pageStore.selectedNodeIds = data.selectedNodeIds || []
  } else if (type === 'widgetGroupsMutation')
    widgetStore.setWidgetGroups(data.widgetGroups || [])
  else if (type === 'screenMutation') {
    screenStore.toggleShowSpacing(data.screenData?.isShowSpacing)
    screenStore.toggleShowOutline(data.screenData?.isShowOutline)
    screenStore.toggleShowHidden(data.screenData?.isShowHidden)
    screenStore.toggleMarker(data.screenData?.isShowMarker)
  } else if (type === 'selectUsingWidget')
    widgetStore.selectUsingWidget(data?.selectedUsingWidgetId)
}

const postPageData = (pageData: Page) => {
  if (pageStore.circuitBreaker.status === 'off')
    postEditorPageMutation(pageData, pageStore.selectedNodeIds)
}

watch(
  () => pageStore.currentPage,
  currentPage => {
    pageStore.circuitBreaker.watch(currentPage?.key)
    postPageData(currentPage)
  },
  { deep: true }
)

const generatedCss = computed(
  () =>
    generateDragAreaCss(widgetStore.widgetGroups) +
    '\n' +
    generateCss(
      pageStore.currentPage?.nodes,
      widgetStore.widgetGroups,
      screenStore.isShowHidden
    )
)

const dragOptions = {
  animation: 200,
  group: { name: 'g1' },
  disabled: false,
  ghostClass: 'ghost',
  draggable: '.draggable'
}

const startHandler = ($event: any) =>
  pageStore.dragNode('start', $event.item.id, $event.oldIndex)

const endHandler = ($event: any) =>
  pageStore.dragNode('end', $event.to.id, $event.newIndex)

const dbClickHandler = (nodeId: string) => {
  pageStore.findNode(nodeId)?.widget
    ? postEditorChangeEditWidgetMode(nodeId)
    : postEditorAddWidget(nodeId)
}
</script>

<style scoped lang="scss"></style>
