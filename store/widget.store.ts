import {defineStore} from "pinia"
import {ref} from "#imports"
import {deepClone} from "~/util/util"
import {usePagesStore} from "~/store/page.store"

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

  const widgetGroups = ref<Group[]>([
    {
      name: "Group",
      items: [
        {
          "html": "<span class='html'>html</span>",
          "css": ".html {color: red;\n" +
              "    border: 1px solid red;\n" +
              "    width: 300px;\n" +
              "    height: 300px;\n" +
              "    display: block;}",
          "name": "html",
          "description": "description"
        }
      ]
    },
    {
      name: "Group2",
      items: [
        {
          "html": "<span class='html2'>html2</span>",
          "css": ".html2 {color: blue;}",
          "name": "html",
          "description": "description"
        }
      ]
    },
  ])

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