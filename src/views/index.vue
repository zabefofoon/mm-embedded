<template>
  <UiStyle>{{ generatedCss }}</UiStyle>
  <div
    class="tw-flex tw-flex-col | tw-relative | tw-w-full tw-h-screen | tw-overflow-hidden">
    <Header />
    <div
      class="tw-flex | tw-w-full tw-h-full"
      style="max-height: calc(100vh - 40px)">
      <PagesPanel />
      <main class="tw-w-full tw-h-full | tw-p-3 | tw-bg-slate-100">
        <div class="tw-flex tw-justify-center | tw-h-full">
          <iframe
            ref="canvas"
            :style="{
              width: screenStore.screenSize.width,
              height: screenStore.screenSize.height
            }"
            class="tw-w-full tw-h-full"
            src="./#/canvas"
            @load="initIframe">
          </iframe>
        </div>
      </main>
      <ConfigNodePanel />
    </div>
    <ConfigWidgetLayer />
  </div>
  <ModalsContainer />
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import { ModalsContainer, useModal } from 'vue-final-modal'
import '../assets/style/basic.scss'
import ConfigNodePanel from '../components/ConfigNodePanel.vue'
import ConfigWidgetLayer from '../components/ConfigWidgetLayer.vue'
import Header from '../components/Header.vue'
import ModalWidgets from '../components/ModalWidgets.vue'
import ModalEditWidgetInstance from '../components/ModalEditWidgetInstance.vue'
import PagesPanel from '../components/PagesPanel.vue'
import UiStyle from '../components/atom/Style.vue'
import {
  postCanvasPageMutation,
  postCanvasScreenMutation,
  postCanvasSelectUsingWidget
} from '../messenger/postToCanvas.msg'
import { receiveFromCanvas } from '../messenger/receiveFromCanvas.msg'
import { receiveFromProject } from '../messenger/receiveFromProject.msg'
import { Page } from '../model/Page'
import type { Item } from '../model/Widget'
import { usePagesStore } from '../store/page.store'
import { usePeerStore } from '../store/peer.store'
import { useScreenStore } from '../store/screen.store'
import { useWidgetStore } from '../store/widget.store'
import { generateCss, generateDragAreaCss } from '../util/generateCss'
import essential from '../assets/json/essential_group.json'

const screenStore = useScreenStore()
const widgetStore = useWidgetStore()
const peerStore = usePeerStore()
const pageStore = usePagesStore()

const { open: openSelectWidgetsModal, close: closeSelectWidgetsModal } =
  useModal({
    component: ModalWidgets,
    attrs: {
      onClose() {
        closeSelectWidgetsModal()
      },
      onSelect(item: Item) {
        pageStore.setWidget(item)
        closeSelectWidgetsModal()
      }
    }
  })

const {
  open: openEditWidgetInstance,
  close: closeEditWidgetInstance,
  patchOptions: setEditWidgetInstance
} = useModal({
  component: ModalEditWidgetInstance,
  attrs: {
    onClose() {
      closeEditWidgetInstance()
    },
    onSelect(item: Item) {
      pageStore.setWidget(item)
      closeEditWidgetInstance()
    }
  }
})

const canvas = ref<HTMLIFrameElement>()

onBeforeMount(() => {
  window.addEventListener('message', listenMessage)
})
onBeforeUnmount(() => window.removeEventListener('message', listenMessage))

onMounted(() => {
  widgetStore.setWidgetGroups(essential)
  setTimeout(widgetStore.postWidgetGroupsToEditor, 1000)
})

const listenCanvasMessage = ($event: MessageEvent) => {
  const [type, data] = receiveFromCanvas($event)

  if (type === 'pageMutation') {
    if (data.pageData && data.pageData?.key !== pageStore.currentPage?.key) {
      pageStore.setPageData(data.pageData)
      pageStore.selectedNodeIds = data.selectedNodeIds || []
      pageStore.selectedNodes.forEach(selectedNode =>
        selectedNode?.selectResponsiveMode(screenStore.responsiveMode)
      )
    }
  } else if (type === 'command') {
    if (data.command === 'removeNode') pageStore.removeNode()
    else if (data.command === 'addChildNode') pageStore.addChildNode()
    else if (data.command === 'addSiblingNodeDown')
      pageStore.addSiblingNodeDown()
    else if (data.command === 'copyNode') pageStore.copyNode()
    else if (data.command === 'cutNode') pageStore.cutNode()
    else if (data.command === 'pasteNode') pageStore.pasteNode()
    else if (data.command === 'undo') pageStore.actionManager.executeUndo()
    else if (data.command === 'redo') pageStore.actionManager.executeRedo()
    else if (data.command === 'selectParentNode') pageStore.selectParentNode()
    else if (data.command === 'selectPrevSiblingNode')
      pageStore.selectPrevSiblingNode()
    else if (data.command === 'selectNextSiblingNode')
      pageStore.selectNextSiblingNode()
    else if (data.command === 'selectChildNode') pageStore.selectChildNode()
  } else if (type === 'dragNode' && data.dragAction)
    pageStore.handleDragNode(data.dragAction)
  else if (type === 'addWidget') openSelectWidgetsModal()
  else if (type === 'changeEditWidgetMode') {
    setEditWidgetInstance({
      attrs: {
        nodeId: data.nodeId!
      }
    })
    openEditWidgetInstance()
  }
}

const listenProjectMessage = ($event: MessageEvent) => {
  const [type, data] = receiveFromProject($event)
  if (type === 'loadData') {
    pageStore.loadPages(data.pages || [Page.of()])
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

const initIframe = () =>
  setTimeout(() => {
    widgetStore.setCanvas(canvas.value)
    postCanvasPages()
    widgetStore.postWidgetStoreToCanvas()
  }, 250)

const postCanvasPages = () => {
  if (pageStore.circuitBreaker.status === 'off')
    postCanvasPageMutation(
      canvas.value,
      pageStore.pages,
      pageStore.selectedNodeIds,
      pageStore.currentPageId
    )
}

watch(() => pageStore.currentPage, postCanvasPages, { deep: true })

watch(
  () => [
    screenStore.isShowSpacing,
    screenStore.isShowOutline,
    screenStore.isShowHidden,
    screenStore.isShowMarker
  ],
  () =>
    postCanvasScreenMutation(
      canvas.value,
      screenStore.isShowSpacing,
      screenStore.isShowOutline,
      screenStore.isShowHidden,
      screenStore.isShowMarker
    )
)

watch(
  () => widgetStore.selectedUsingWidgetId,
  selectedUsingWidgetId =>
    postCanvasSelectUsingWidget(canvas.value, selectedUsingWidgetId)
)

const listenKeydown = ($event: KeyboardEvent) => {
  const isCtrl = $event.ctrlKey || $event.metaKey
  if ($event.code === 'KeyZ' && isCtrl && $event.shiftKey) {
    $event.preventDefault()
    pageStore.actionManager.executeRedo()
  } else if ($event.code === 'KeyZ' && isCtrl) {
    $event.preventDefault()
    pageStore.actionManager.executeUndo()
  }
}

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

onMounted(() => window.addEventListener('keydown', listenKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', listenKeydown))
</script>

<style scoped></style>
