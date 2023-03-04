import {defineStore} from "pinia"
import {ref} from "#imports"
import {deepClone} from "~/util/util"
import {usePagesStore} from "~/store/page.store"
import essentialGroups from "~/assets/json/essential_group.json"

export type Group = {
  name: string
  items: Item[]
}

export type Item = {
  id?: string
  html: string
  css: string
  name: string
  description: string
}

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

  const widgetGroups = ref<Group[]>(essentialGroups)

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