import {defineStore} from "pinia"
import {computed, ref, watch} from "vue"
import {deepClone} from "../util/util"
import {usePagesStore} from "./page.store"
import type {Group} from "../model/Widget"
import {useScreenStore} from "./screen.store"

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

  const postWidgetGroupsToEditor = () => widgetEditor.value
      ?.contentWindow
      ?.postMessage({
        type: 'realtimeSetGroups',
        groups: deepClone(widgetGroups.value)
      }, '*')

  const isLayerShow = ref(false)
  const toggleLayer = (value?: boolean) => {
    isLayerShow.value = value !== undefined ? value : !isLayerShow.value
  }

  const widgetGroups = ref<Group[]>([])

  const setWidgetGroups = (groups: Group[]) => {
    widgetGroups.value = groups
    postWidgetStoreToCanvas()
    pageStore.updateNodesWidget()
  }

  const postWidgetStoreToCanvas = () => canvas.value
      ?.contentWindow
      ?.postMessage({
        type: 'widgetGroupsMutation',
        data: deepClone(widgetGroups.value)
      })

  const widgets = computed(() => widgetGroups.value.flatMap((group) => group.items))

  const selectedUsingWidgetId = ref()
  const selectUsingWidget = (widgetId?: string) => selectedUsingWidgetId.value = widgetId

  const getUsingWidgetLength = (widgetId?: string) => {
    let length = 0
    pageStore.nodeForEach((node) => {
      if (node.widget?.id === widgetId) length++
    })
    return length
  }

  const getUsingWidget = (widgetId?: string) => widgets.value
      .find((widget) => widget.id === widgetId)

  watch(() => screenStore.screenMode === 'analyzeWidget',
      () => selectUsingWidget())

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

    getUsingWidget
  }
})