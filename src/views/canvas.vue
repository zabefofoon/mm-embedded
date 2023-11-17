<template>
  <div class="tw-bg-white tw-shadow-md | tw-min-h-screen"
       @click="pageStore.selectNodeOne()">
    <UiStyle>{{ generatedCss }}</UiStyle>
    <draggable v-bind="dragOptions"
               :list="pageStore.currentPage?.nodes"
               @start="startHandler"
               @end="endHandler">
      <Node v-for="node in pageStore.currentPage?.nodes"
            :key="node.id"
            :node="node"/>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed, onBeforeUnmount, onMounted, watch} from "vue"
import UiStyle from "../components/atom/Style.vue"
import Node from "../components/Node.vue"
import {generateCss, generateDragAreaCss} from "../util/generateCss"
import {useWidgetStore} from "../store/widget.store"
import {storeToRefs} from "pinia"
import {useScreenStore} from "../store/screen.store"
import {VueDraggableNext as Draggable} from "vue-draggable-next"
import {postEditorCommand, postEditorPageMutation} from "../messenger/postToEditor.msg"
import {receiveFromEditor} from "../messenger/receiveFromEditor.msg"
import type {Page} from "../model/Page"

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
  else if ($event.code === 'Enter' && isCtrl)
    postEditorCommand('addChildNode')
  else if ($event.code === 'Enter')
    postEditorCommand('addSiblingNodeDown')
  else if ($event.code === 'KeyC')
    postEditorCommand('copyNode')
  else if ($event.code === 'KeyX')
    postEditorCommand('cutNode')
  else if ($event.code === 'KeyV')
    postEditorCommand('pasteNode')
  else if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey)
    postEditorCommand('redo')
  else if ($event.code === 'KeyZ' && isCtrl)
    postEditorCommand('undo')
  else if ($event.code === 'ArrowUp' && isCtrl)
    postEditorCommand('selectParentNode')
  else if ($event.code === 'ArrowUp')
    postEditorCommand('selectPrevSiblingNode')
  else if ($event.code === 'ArrowUp')
    postEditorCommand('selectPrevSiblingNode')
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

const screenStore = useScreenStore()
const {isShowHidden} = storeToRefs(screenStore)

const pageStore = usePagesStore()
const postPageData = (pageData: Page) => {
  if (pageStore.circuitBreaker.status === 'off')
    postEditorPageMutation(pageData, pageStore.selectedNodeIds)
}


watch(() => pageStore.currentPage,
    (currentPage) => {
      pageStore.circuitBreaker.watch(currentPage?.key)
      postPageData(currentPage)
    },
    {deep: true})

const widgetStore = useWidgetStore()
const {widgetGroups} = storeToRefs(widgetStore)

const generatedCss = computed(() => generateDragAreaCss() + '\n' + generateCss(pageStore.currentPage?.nodes, widgetGroups.value, isShowHidden.value))

const dragOptions = {
  animation: 200,
  group: {name: 'g1'},
  disabled: false,
  ghostClass: 'ghost',
  draggable: '.draggable'
}

const startHandler = ($event: any) => pageStore.dragNode('start', $event.item.id, $event.oldIndex)

const endHandler = ($event: any) => pageStore.dragNode('end', $event.to.id, $event.newIndex)
</script>

<style scoped lang="scss">

</style>