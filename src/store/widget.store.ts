import {defineStore} from "pinia"
import {ref} from "vue"
import {deepClone} from "../util/util"
import {usePagesStore} from "./page.store"
import type {Group} from "../model/Widget"


export const useWidgetStore = defineStore('widgets', () => {
  const pageStore = usePagesStore()

  const canvas = ref<HTMLIFrameElement>()
  const setCanvas = (iframe?: HTMLIFrameElement) => {
    canvas.value = iframe
  }

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

  return {
    setCanvas,
    postWidgetStoreToCanvas,

    isLayerShow,
    toggleLayer,

    widgetGroups,
    setWidgetGroups
  }
})