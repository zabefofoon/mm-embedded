import {defineStore} from "pinia"
import {computed, reactive, ref} from "#imports"
import {deepClone, generateUniqueId} from "~/util/util"
import {useWidgetStore} from "~/store/widget.store"
import {CrossAxis, Direction, MainAxis, Node, NodeDirection, NodeLayoutType, ResponsiveMode} from "~/model/Node"
import {Item} from "~/model/Widget"
import {ActionManager} from "~/model/ActionManager"
import {
  AddChildNode,
  AddMarker,
  AddParentNode,
  AddSiblingNodeDown,
  AddSiblingNodeUp,
  PasteNode,
  RemoveMarker,
  RemoveNode,
  RemoveParentNode,
  RemoveWidget,
  SelectResponsiveMode,
  SetNodesLayoutCrossAxis,
  SetNodesLayoutGap,
  SetNodesLayoutGridColumns,
  SetNodesLayoutHeight,
  SetNodesLayoutHidden,
  SetNodesLayoutMainAxis,
  SetNodesLayoutMaxWidth, SetNodesLayoutPadding,
  SetNodesLayoutStackDirection,
  SetNodesLayoutType,
  SetNodesLayoutWidth,
  SetWidget
} from "~/model/Action"

export type PageData = {
  id: string
  name: string
  key: number
  nodes: Node[]
  selectedIds: string[]
}

const createPage = (): PageData => ({
  id: generateUniqueId(),
  name: 'Page',
  key: 0,
  nodes: [new Node()],
  selectedIds: [],
})

export const usePagesStore = defineStore('pages', () => {

      const widgetStore = useWidgetStore()

      const initialPage = createPage()

      const pages = ref<PageData[]>([initialPage])

      const currentPageId = ref<string | undefined>(initialPage.id)

      const currentPage = computed(() => <PageData>pages.value.find((page) => page.id === currentPageId.value))

      const actionManager = reactive(new ActionManager())

      const selectPage = (pageId?: string) => {
        currentPageId.value = pageId
        actionManager.emptyActions()
      }

      const loadPages = (_pages: PageData[]) => {
        pages.value = _pages

        pages.value.forEach((page) => page.nodes = Node.makeNodes(page.nodes))
      }

      const addPage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        const created = createPage()
        pages.value.splice(index + 1, 0, created)
        selectPage(created.id)
      }

      const copyPage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        const created = createPage()
        created.nodes = Node.makeNodes(deepClone(currentPage.value?.nodes || []))
        created.name = `[Copy]${currentPage.value?.name}`
        pages.value.splice(index + 1, 0, created)
        selectPage(created.id)
      }

      const removePage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        pages.value.splice(index, 1)

        selectPage(pages.value.at(index - 1)?.id)
      }

      const moveUpPage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        const page = pages.value.splice(index, 1)[0]
        pages.value.splice(index - 1, 0, page)
      }

      const moveDownPage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        const page = pages.value.splice(index, 1)[0]
        pages.value.splice(index + 1, 0, page)
      }

      const selectedNodes = computed(() => currentPage.value.selectedIds.map((id) => findNode(id)))

      const setPageData = (pageData: PageData) => {
        pages.value.forEach((page) => {
          if (page.id === pageData.id) {
            page.key++
            page.key = pageData.key
            page.nodes = Node.makeNodes(pageData.nodes)
            page.selectedIds = pageData.selectedIds
          }
        })
      }

      const addSiblingNodeUp = () => actionManager.execute(AddSiblingNodeUp.of())

      const addSiblingNodeDown = () => actionManager.execute(AddSiblingNodeDown.of())

      const addChildNode = () => actionManager.execute(AddChildNode.of())

      const addParentNode = () => actionManager.execute(AddParentNode.of())

      const removeNode = () => actionManager.execute(RemoveNode.of())

      const removeParentNode = () => actionManager.execute(RemoveParentNode.of())

      const selectResponsiveMode = (responsiveMode: ResponsiveMode) => actionManager.execute(SelectResponsiveMode.of(responsiveMode))

      const setNodesLayoutType = (type: NodeLayoutType) => actionManager.execute(SetNodesLayoutType.of(type))

      const setNodesLayoutStackDirection = (direction: NodeDirection) => actionManager.execute(SetNodesLayoutStackDirection.of(direction))

      const setNodesLayoutGridColumns = (columns: number) => actionManager.execute(SetNodesLayoutGridColumns.of(columns))

      const setNodesLayoutGap = (gap: string) => actionManager.execute(SetNodesLayoutGap.of(gap))

      const setNodesLayoutWidth = (width: string) => actionManager.execute(SetNodesLayoutWidth.of(width))

      const setNodesLayoutMaxWidth = (maxWidth: string) => actionManager.execute(SetNodesLayoutMaxWidth.of(maxWidth))

      const setNodesLayoutHeight = (height: string) => actionManager.execute(SetNodesLayoutHeight.of(height))

      const setNodesLayoutMainAxis = (mainAxis: MainAxis) => actionManager.execute(SetNodesLayoutMainAxis.of(mainAxis))

      const setNodesLayoutCrossAxis = (crossAxis: CrossAxis) => actionManager.execute(SetNodesLayoutCrossAxis.of(crossAxis))

      const setNodesLayoutHidden = (hidden: boolean) => actionManager.execute(SetNodesLayoutHidden.of(hidden))

      const setNodesLayoutPadding = (direction: Direction, value: string) => actionManager.execute(SetNodesLayoutPadding.of(direction, value))

      const setWidget = (widget: Item) => actionManager.execute(SetWidget.of(widget))

      const removeWidget = () => actionManager.execute(RemoveWidget.of())

      const updateNodesWidget = () => {
        const recursive = (nodes: Node[]) => {
          nodes?.forEach((node) => {
            if (node.widget) node.widget = widgetStore
                .widgetGroups
                .flatMap((group) => group.items)
                .find((item) => item.id === node.widget?.id)

            recursive(node.nodes)
          })
        }

        recursive(currentPage.value.nodes)
      }

      const getSelectedNodeOne = () => findNode(currentPage.value.selectedIds[0])

      const copiedNode = ref<Node>()
      const setCopiedNode = (node: Node) => {
        copiedNode.value = node
      }
      const copyNode = () => {
        copiedNode.value = getSelectedNodeOne()

        currentPage.value.key++
      }

      const cutNode = () => {
        copiedNode.value = getSelectedNodeOne()

        removeNode()
      }

      const pasteNode = () => actionManager.execute(PasteNode.of())

      const selectNodeOne = (id?: string) => {
        if (currentPage.value) {
          currentPage.value.selectedIds = id === undefined ? [] : [id]
          currentPage.value.key++
        }
      }

      const addNodeMarker = () => actionManager.execute(AddMarker.of())

      const removeNodeMarker = () => actionManager.execute((RemoveMarker.of()))

      const selectNodeMany = (id: string) => {
        currentPage.value.selectedIds.push(id)
        currentPage.value.key++
      }

      const findNode = (id?: string): Node | undefined => {
        let found

        const search = (nodes: Node[]) => {
          if (nodes.length > 0)
            nodes?.forEach((node) => {
              if (id === node.id)
                found = node
              else if (node.nodes.length > 0)
                search(node.nodes)
            })
        }
        search(currentPage.value.nodes)
        return found
      }

      return {
        actionManager,

        pages,
        loadPages,
        addPage,
        copyPage,
        removePage,

        moveUpPage,
        moveDownPage,

        currentPageId,
        currentPage,
        selectPage,
        setPageData,

        selectedNodes,

        addSiblingNodeUp,
        addSiblingNodeDown,
        addChildNode,
        addParentNode,

        removeNode,
        removeParentNode,

        selectNodeOne,
        selectNodeMany,

        setNodesLayoutType,
        setNodesLayoutStackDirection,
        setNodesLayoutGridColumns,
        setNodesLayoutGap,
        selectResponsiveMode,
        setNodesLayoutWidth,
        setNodesLayoutMaxWidth,
        setNodesLayoutHeight,
        setNodesLayoutMainAxis,
        setNodesLayoutCrossAxis,
        setNodesLayoutHidden,
        setNodesLayoutPadding,

        setWidget,
        removeWidget,

        updateNodesWidget,

        findNode,

        getSelectedNodeOne,

        copiedNode,
        setCopiedNode,
        copyNode,
        cutNode,
        pasteNode,

        addNodeMarker,
        removeNodeMarker,
      }
    }
)