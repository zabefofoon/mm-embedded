import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { usePagesStore } from './page.store'
import type { Group, Item } from '../model/Widget'
import { useScreenStore } from './screen.store'
import { postCanvasWidgetGroupsMutation } from '../messenger/postToCanvas.msg'
import { postInjectGroups as _postWidgetGroupsToEditor } from '../messenger/postToWidgetLayer.msg'
import { generateUniqueId } from '../util/util'

export const useWidgetStore = defineStore('widgets', () => {
  const screenStore = useScreenStore()
  const pageStore = usePagesStore()

  const canvas = ref<HTMLIFrameElement>()
  const setCanvas = (iframe?: HTMLIFrameElement) => {
    canvas.value = iframe
  }

  const widgetEditor = ref<HTMLIFrameElement>()
  const setWidgetEditor = (iframe?: HTMLIFrameElement) => {
    widgetEditor.value = iframe
  }

  const postWidgetGroupsToEditor = () =>
    _postWidgetGroupsToEditor(widgetEditor.value, widgetGroups.value)

  const isLayerShow = ref(false)
  const toggleLayer = (value?: boolean) => {
    isLayerShow.value = value !== undefined ? value : !isLayerShow.value
  }

  const widgetGroups = ref<Group[]>([])

  const setWidgetGroups = (groups: Group[]) => {
    widgetGroups.value = groups
    postCanvasWidgetGroupsMutation(canvas.value, widgetGroups.value)
    postWidgetStoreToCanvas()
    pageStore.updateNodesWidget()
  }

  const postWidgetStoreToCanvas = () =>
    postCanvasWidgetGroupsMutation(canvas.value, widgetGroups.value)

  const widgets = computed(() =>
    widgetGroups.value.flatMap(group => group.items)
  )

  const selectedUsingWidgetId = ref()
  const selectUsingWidget = (widgetId?: string) =>
    (selectedUsingWidgetId.value = widgetId)

  const getUsingWidgetLength = (widgetId?: string) => {
    let length = 0
    pageStore.nodeForEach(node => {
      if (node.widget?.id === widgetId) length++
    })
    return length
  }

  const getUsingWidget = (widgetId?: string) =>
    widgets.value.find(widget => widget.id === widgetId)

  watch(
    () => screenStore.screenMode === 'analyzeWidget',
    () => selectUsingWidget()
  )

  const importWidgets = (items: Item[]) => {
    items.forEach(item => {
      item.id = generateUniqueId()
    })

    const foundImportedGroup = widgetGroups.value.find(
      group => group.name === 'imported'
    )

    foundImportedGroup
      ? (foundImportedGroup.items = [...foundImportedGroup.items, ...items])
      : widgetGroups.value.push({ name: 'imported', items })

    postWidgetGroupsToEditor()
    postWidgetStoreToCanvas()
  }

  return {
    setCanvas,
    postWidgetStoreToCanvas,

    isLayerShow,
    toggleLayer,

    widgetGroups,
    setWidgetGroups,

    widgetEditor,
    setWidgetEditor,

    postWidgetGroupsToEditor,

    widgets,
    getUsingWidgetLength,

    selectedUsingWidgetId,
    selectUsingWidget,

    getUsingWidget,
    importWidgets
  }
})
