import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { postEditorDragNode } from '../messenger/postToEditor.msg'
import {
  AddChildNode,
  AddMarker,
  AddParentNode,
  AddSiblingNodeDown,
  AddSiblingNodeUp,
  DragNode,
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
  SetNodesLayoutInset,
  SetNodesLayoutMainAxis,
  SetNodesLayoutMaxWidth,
  SetNodesLayoutPadding,
  SetNodesLayoutPosition,
  SetNodesLayoutStackDirection,
  SetNodesLayoutType,
  SetNodesLayoutWidth,
  SetNodesLayoutZIndex,
  SetNodesTransparent,
  SetWidget,
  SetWidgetInstance
} from '../model/Action'
import { ActionManager } from '../model/ActionManager'
import { CircuitBreaker } from '../model/CircuitBreaker'
import type {
  CrossAxis,
  Direction,
  MainAxis,
  NodeDirection,
  NodeLayoutType,
  Position,
  ResponsiveMode
} from '../model/Node'
import { Node } from '../model/Node'
import { Page } from '../model/Page'
import type { Item } from '../model/Widget'
import { deepClone } from '../util/util'
import { useWidgetStore } from './widget.store'
import type { DownloadOptions } from '../model/DownloadOptions'

export const usePagesStore = defineStore('pages', () => {
  const selectedNodeIds = ref<string[]>([])

  const widgetStore = useWidgetStore()

  const initialPage = Page.of()

  const pages = ref<Page[]>([initialPage])

  const currentPageId = ref<string | undefined>(initialPage.id)

  const currentPage = computed(
    () => <Page>pages.value.find(page => page.id === currentPageId.value)
  )
  const updateCurrentPageKey = () => currentPage.value.key++

  const actionManager = reactive(new ActionManager())

  const selectPage = (pageId?: string) => {
    currentPageId.value = pageId
    actionManager.emptyActions()
  }

  const loadPages = (_pages: Page[]) => {
    pages.value = _pages

    pages.value.forEach(page => (page.nodes = Node.makeNodes(page.nodes)))
  }

  const addPage = () => {
    const index = pages.value.findIndex(page => page.id === currentPageId.value)
    const created = Page.of()
    pages.value.splice(index + 1, 0, created)
    selectPage(created.id)
  }

  const copyPage = () => {
    const index = pages.value.findIndex(page => page.id === currentPageId.value)
    const created = Page.of()
    created.nodes = Node.makeNodes(deepClone(currentPage.value?.nodes || []))
    created.name = `[Copy]${currentPage.value?.name}`
    pages.value.splice(index + 1, 0, created)
    selectPage(created.id)
  }

  const removePage = () => {
    const index = pages.value.findIndex(page => page.id === currentPageId.value)
    pages.value.splice(index, 1)

    selectPage(pages.value.at(index - 1)?.id)
  }

  const moveUpPage = () => {
    const index = pages.value.findIndex(page => page.id === currentPageId.value)
    const page = pages.value.splice(index, 1)[0]
    pages.value.splice(index - 1, 0, page)
  }

  const moveDownPage = () => {
    const index = pages.value.findIndex(page => page.id === currentPageId.value)
    const page = pages.value.splice(index, 1)[0]
    pages.value.splice(index + 1, 0, page)
  }

  const selectedNodes = computed(() =>
    selectedNodeIds.value.map(id => findNode(id))
  )

  const setPageData = (pageData: Page) => {
    pages.value.forEach(page => {
      if (page.id === pageData.id) {
        page.key++
        page.key = pageData.key
        page.nodes = Node.makeNodes(pageData.nodes)
      }
    })
  }

  const addSiblingNodeUp = () => actionManager.execute(AddSiblingNodeUp.of())

  const addSiblingNodeDown = () =>
    actionManager.execute(AddSiblingNodeDown.of())

  const addChildNode = () => actionManager.execute(AddChildNode.of())

  const addParentNode = () => actionManager.execute(AddParentNode.of())

  const removeNode = () => actionManager.execute(RemoveNode.of())

  const removeParentNode = () => actionManager.execute(RemoveParentNode.of())

  const selectResponsiveMode = (responsiveMode: ResponsiveMode) =>
    actionManager.execute(SelectResponsiveMode.of(responsiveMode))

  const setNodesLayoutType = (type: NodeLayoutType) =>
    actionManager.execute(SetNodesLayoutType.of(type))

  const setNodesLayoutStackDirection = (direction: NodeDirection) =>
    actionManager.execute(SetNodesLayoutStackDirection.of(direction))

  const setNodesLayoutGridColumns = (columns: number) =>
    actionManager.execute(SetNodesLayoutGridColumns.of(columns))

  const setNodesLayoutGap = (gap: string) =>
    actionManager.execute(SetNodesLayoutGap.of(gap))

  const setNodesLayoutWidth = (width: string) =>
    actionManager.execute(SetNodesLayoutWidth.of(width))

  const setNodesLayoutMaxWidth = (maxWidth: string) =>
    actionManager.execute(SetNodesLayoutMaxWidth.of(maxWidth))

  const setNodesLayoutHeight = (height: string) =>
    actionManager.execute(SetNodesLayoutHeight.of(height))

  const setNodesLayoutMainAxis = (mainAxis: MainAxis) =>
    actionManager.execute(SetNodesLayoutMainAxis.of(mainAxis))

  const setNodesLayoutCrossAxis = (crossAxis: CrossAxis) =>
    actionManager.execute(SetNodesLayoutCrossAxis.of(crossAxis))

  const setNodesLayoutHidden = (hidden: boolean) =>
    actionManager.execute(SetNodesLayoutHidden.of(hidden))

  const setNodesLayoutPosition = (position: Position) =>
    actionManager.execute(SetNodesLayoutPosition.of(position))

  const setNodesLayoutZIndex = (zIndex: number) =>
    actionManager.execute(SetNodesLayoutZIndex.of(zIndex))

  const setNodesLayoutPadding = (direction: Direction, value: string) =>
    actionManager.execute(SetNodesLayoutPadding.of(direction, value))

  const setNodesLayoutInset = (direction: Direction, value: string) =>
    actionManager.execute(SetNodesLayoutInset.of(direction, value))

  const setNodesTransparent = (value: boolean) =>
    actionManager.execute(SetNodesTransparent.of(value))

  const setWidget = (widget: Item) =>
    actionManager.execute(SetWidget.of(widget))

  const removeWidget = () => actionManager.execute(RemoveWidget.of())

  const updateNodesWidget = () => {
    const recursive = (nodes: Node[] = []) => {
      nodes?.forEach(node => {
        if (!node.widget?.instance)
          node.widget = widgetStore.widgetGroups
            .flatMap(group => group.items)
            .find(item => item.id === node.widget?.id)

        recursive(node.nodes)
      })
    }

    recursive(currentPage.value?.nodes)
  }

  const getSelectedNodeOne = () => findNode(selectedNodeIds.value[0])

  const copiedNode = ref<Node>()
  const setCopiedNode = (node: Node) => {
    copiedNode.value = node
  }
  const copyNode = () => {
    copiedNode.value = getSelectedNodeOne()
    updateCurrentPageKey()
  }

  const cutNode = () => {
    copiedNode.value = getSelectedNodeOne()

    removeNode()
  }

  const pasteNode = () => actionManager.execute(PasteNode.of())

  const selectNodeOne = (id?: string) => {
    if (currentPage.value) {
      selectedNodeIds.value = id === undefined ? [] : [id]
      updateCurrentPageKey()
    }
  }

  const selectParentNode = () => {
    selectedNodeIds.value = selectedNodes.value[0]?.parentId
      ? [selectedNodes.value[0]?.parentId]
      : []
    updateCurrentPageKey()
  }

  const selectPrevSiblingNode = () => {
    if (selectedNodeIds.value.length === 0) {
      selectNodeOne(currentPage.value.nodes.at(-1)?.id)
    } else {
      const parent = findNode(selectedNodeIds.value[0])?.parentId
        ? findNode(findNode(selectedNodeIds.value[0])?.parentId)
        : currentPage.value

      const foundIndex =
        parent?.nodes.findIndex(node => node.id === selectedNodeIds.value[0]) ||
        0
      const index =
        foundIndex - 1 < 0 ? (parent?.nodes.length || 0) - 1 : foundIndex - 1

      selectNodeOne(parent?.nodes[index].id)
    }

    updateCurrentPageKey()
  }

  const selectNextSiblingNode = () => {
    if (selectedNodeIds.value.length === 0) {
      selectNodeOne(currentPage.value.nodes.at(0)?.id)
    } else {
      const parent = findNode(selectedNodeIds.value[0])?.parentId
        ? findNode(findNode(selectedNodeIds.value[0])?.parentId)
        : currentPage.value

      const foundIndex =
        parent?.nodes.findIndex(node => node.id === selectedNodeIds.value[0]) ||
        0

      const index =
        foundIndex + 1 > (parent?.nodes.length || 0) - 1 ? 0 : foundIndex + 1

      selectNodeOne(parent?.nodes[index].id)
    }
    updateCurrentPageKey()
  }

  const selectChildNode = () => {
    selectedNodeIds.value.length === 0
      ? selectNodeOne(currentPage.value.nodes.at(0)?.id)
      : selectNodeOne(findNode(selectedNodeIds.value[0])?.nodes[0]?.id)
    updateCurrentPageKey()
  }

  const addNodeMarker = () => actionManager.execute(AddMarker.of())

  const removeNodeMarker = () => actionManager.execute(RemoveMarker.of())

  const selectNodeMany = (id: string) => {
    selectedNodeIds.value.push(id)
    updateCurrentPageKey()
  }

  const findNode = (id?: string): Node | undefined => {
    let found

    const search = (nodes: Node[] = []) => {
      if (nodes.length > 0)
        nodes?.forEach(node => {
          if (id === node.id) found = node
          else if (node.nodes.length > 0) search(node.nodes)
        })
    }
    search(currentPage.value?.nodes)
    return found
  }

  const nodeForEach = (cb: (node: Node) => void) => {
    const recursive = (nodes: Node[]) => {
      nodes.forEach(node => {
        cb(node)
        recursive(node.nodes)
      })
    }

    pages.value.map(page => page.nodes).forEach(nodes => recursive(nodes))
  }

  const circuitBreaker = new CircuitBreaker()

  let dragAction: Partial<DragNode> = {}
  const dragNode = (type: 'start' | 'end', nodeId: string, index: number) => {
    if (type === 'start') {
      dragAction.nodeId = nodeId
      dragAction.oldIndex = index
    } else {
      dragAction.parentId = nodeId
      dragAction.newIndex = index
      postEditorDragNode(dragAction)

      dragAction = {}
    }
  }

  const handleDragNode = (dragNode: DragNode) => {
    actionManager.execute(DragNode.of(dragNode))
    updateCurrentPageKey()
  }

  const downloadOptions = ref<DownloadOptions>({
    includePreflight: true,
    showBorder: false,
    showEmptyArea: true
  })

  const setDownloadOptions = (key: keyof DownloadOptions, value: boolean) =>
    (downloadOptions.value[key] = value)

  const toggleDownloadOptions = (key: keyof DownloadOptions) =>
    (downloadOptions.value[key] = !downloadOptions.value[key])

  const setWidgetInstance = (nodeId: string, instance: string) => {
    actionManager.execute(SetWidgetInstance.of(nodeId, instance))
  }

  return {
    selectedNodeIds,

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
    selectParentNode,
    selectPrevSiblingNode,
    selectNextSiblingNode,
    selectChildNode,

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
    setNodesLayoutInset,
    setNodesLayoutPosition,
    setNodesTransparent,
    setNodesLayoutZIndex,

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

    nodeForEach,

    circuitBreaker,

    dragNode,
    handleDragNode,

    updateCurrentPageKey,

    downloadOptions,
    setDownloadOptions,
    toggleDownloadOptions,

    setWidgetInstance
  }
})
