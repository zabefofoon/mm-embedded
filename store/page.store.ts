import {defineStore} from "pinia"
import {computed, ref} from "#imports"
import {deepClone, generateUniqueId} from "~/util/util"
import {useWidgetStore} from "~/store/widget.store"
import {CrossAxis, MainAxis, Node, NodeDirection, NodeLayoutType, ResponsiveMode} from "~/model/Node"
import {Item} from "~/model/Widget"

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
  nodes: [],
  selectedIds: [],
})

export const usePagesStore = defineStore('pages', () => {
      const widgetStore = useWidgetStore()

      const syncKey = ref(0)
      const updateSyncKey = () => {
        syncKey.value++
      }

      const initialPage = createPage()

      const pages = ref<PageData[]>([initialPage])

      const loadPages = (_pages: PageData[]) => {
        pages.value = _pages

        pages.value.forEach((page) => page.nodes = Node.makeNodes(page.nodes))
      }

      const addPage = () => {
        const created = createPage()
        pages.value.push(created)
        selectPage(created.id)
      }

      const copyPage = () => {
        const created = createPage()
        created.nodes = Node.makeNodes(deepClone(currentPage.value?.nodes || []))
        created.name = `[Copy]${currentPage.value?.name}`
        pages.value.push(created)
        selectPage(created.id)
      }

      const removePage = () => {
        const index = pages.value.findIndex((page) => page.id === currentPageId.value)
        pages.value.splice(index, 1)

        selectPage(pages.value.at(index - 1)?.id)
      }

      const currentPageId = ref<string | undefined>(initialPage.id)
      const selectPage = (pageId?: string) => {
        currentPageId.value = pageId
      }

      const currentPage = computed(() => <PageData>pages.value.find((page) => page.id === currentPageId.value))

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

      const addSiblingNodeUp = () => {
        let createdNodeIds: string[] = []

        currentPage.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              currentPage.value.nodes.push(createdNode)
            })
            : currentPage.value.selectedIds.forEach((selectedId) => {

              const found = findNode(selectedId)
              const parent = findNode(found?.parentId)
              const index = parent
                  ? parent.nodes.findIndex((item) => item.id === found?.id)
                  : currentPage.value.nodes.findIndex((item) => item.id === found?.id)

              const createdNode = parent ? new Node(parent.id) : new Node()
              createdNodeIds.push(createdNode.id)

              parent
                  ? parent.nodes.splice(index, 0, createdNode)
                  : currentPage.value.nodes.splice(index, 0, createdNode)
            })

        currentPage.value.selectedIds = createdNodeIds
        currentPage.value.key++
      }

      const addSiblingNodeDown = () => {
        let createdNodeIds: string[] = []

        currentPage.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              currentPage.value.nodes.push(createdNode)
            })
            : currentPage.value.selectedIds.forEach((selectedId) => {

              const found = findNode(selectedId)
              const parent = findNode(found?.parentId)
              const index = parent
                  ? parent.nodes.findIndex((item) => item.id === found?.id)
                  : currentPage.value.nodes.findIndex((item) => item.id === found?.id)

              const createdNode = parent ? new Node(parent.id) : new Node()
              createdNodeIds.push(createdNode.id)

              parent
                  ? parent.nodes.splice(index + 1, 0, createdNode)
                  : currentPage.value.nodes.splice(index + 1, 0, createdNode)
            })

        currentPage.value.selectedIds = createdNodeIds
        currentPage.value.key++
      }

      const addChildNode = () => {
        let createdNodeIds: string[] = []

        currentPage.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              currentPage.value.nodes.push(createdNode)
            })
            : currentPage.value.selectedIds
                .forEach((selectedId) => {
                  const found = findNode(selectedId)
                  if (found) {
                    const createdNode = new Node(found.id)
                    createdNodeIds.push(createdNode.id)
                    found.nodes.push(createdNode)
                  }
                })

        currentPage.value.selectedIds = createdNodeIds
        currentPage.value.key++
      }

      const addParentNode = () => {
        let createdNodeIds: string[] = []

        currentPage.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              currentPage.value.nodes.push(createdNode)
            })
            : currentPage.value.selectedIds
                .forEach((selectedId) => {
                  const found = findNode(selectedId)
                  if (found) {
                    const createdNode = new Node(found.id)
                    createdNodeIds.push(found.id)

                    createdNode.widget = found.widget
                    found.widget = undefined
                    createdNode.nodes = found.nodes
                    found.nodes = [createdNode]
                    createdNode.layout = found.layout
                    found.layout = {
                      small: {
                        type: 'stack',
                        direction: 'vertical',
                        hidden: false
                      },
                      large: {
                        type: undefined,
                        direction: undefined,
                        hidden: false
                      }
                    }
                  }
                })

        currentPage.value.selectedIds = createdNodeIds
        currentPage.value.key++
      }

      const removeNode = () => {
        const deletedNodes: Node[] = []
        let deletedIndex = 0

        currentPage.value.selectedIds.forEach((selectedId) => {
          const found = findNode(selectedId)
          const parent = findNode(found?.parentId)
          const index = parent
              ? parent.nodes.findIndex((item) => item.id === found?.id)
              : currentPage.value.nodes.findIndex((item) => item.id === found?.id)

          deletedIndex = index

          const deletedNode = parent
              ? parent.nodes.splice(index, 1)[0]
              : currentPage.value.nodes.splice(index, 1)[0]

          deletedNodes.push(deletedNode)
        })

        if (deletedNodes.length > 1)
          currentPage.value.selectedIds = []
        else {
          const parent = findNode(deletedNodes[0].parentId)

          parent
              ? currentPage.value.selectedIds = parent.nodes.length > 0
                  ? [parent.nodes[Math.max(0, deletedIndex - 1)].id]
                  : [parent.id]
              : currentPage.value.selectedIds = currentPage.value.nodes.length > 0
                  ? [currentPage.value.nodes[Math.max(0, deletedIndex - 1)].id]
                  : []
        }

        currentPage.value.key++
      }

      const removeParentNode = () => {
        const selectedNode = <Node>getSelectedNodeOne()
        const parentNode = findNode(getSelectedNodeOne()?.parentId)
        const grandParentNode = findNode(parentNode?.parentId)

        if (grandParentNode) {
          const foundIndex = grandParentNode.nodes.findIndex((node) => node.id === parentNode?.id)
          grandParentNode.nodes.splice(foundIndex, 1, selectedNode)
          selectedNode.parentId = grandParentNode.id
        } else {
          const foundIndex = currentPage.value.nodes.findIndex((node) => node.id === parentNode?.id)
          currentPage.value.nodes.splice(foundIndex, 1, selectedNode)
          selectedNode.parentId = undefined
        }

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

      const selectResponsiveMode = (responsiveMode: ResponsiveMode) => {
        selectedNodes.value[0]?.selectResponsiveMode(responsiveMode)
        currentPage.value.key++
      }

      const selectNodeOne = (id?: string) => {
        if (currentPage.value) {
          currentPage.value.selectedIds = id === undefined ? [] : [id]
          currentPage.value.key++
        }
      }

      const selectNodeMany = (id: string) => {
        currentPage.value.selectedIds.push(id)
        currentPage.value.key++
      }

      const setNodesLayoutType = (type: NodeLayoutType) => {
        selectedNodes.value
            .forEach((node) => {
              node?.setLayoutType(type)

              if (type === 'stack')
                node?.setLayoutStackDirection('vertical')
            })

        currentPage.value.key++
      }

      const setNodesLayoutStackDirection = (direction: NodeDirection) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutStackDirection(direction))

        currentPage.value.key++
      }

      const setNodesLayoutGridColumns = (columns: number) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutGridColumns(columns))

        currentPage.value.key++
      }

      const setNodesLayoutGap = (gap: string) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutGap(gap))

        currentPage.value.key++
      }

      const setNodesLayoutWidth = (width: string) => {
        selectedNodes.value
            .forEach((node) => node?.setWidth(width))
        currentPage.value.key++
      }

      const setNodesLayoutMaxWidth = (maxWidth: string) => {
        selectedNodes.value
            .forEach((node) => node?.setMaxWidth(maxWidth))
        currentPage.value.key++
      }

      const setNodesLayoutHeight = (height: string) => {
        selectedNodes.value
            .forEach((node) => node?.setHeight(height))

        currentPage.value.key++
      }

      const setNodesLayoutMainAxis = (mainAxis: MainAxis) => {
        selectedNodes.value
            .forEach((node) => node?.setMainAxis(mainAxis))
        currentPage.value.key++
      }

      const setNodesLayoutCrossAxis = (crossAxis: CrossAxis) => {
        selectedNodes.value
            .forEach((node) => node?.setCrossAxis(crossAxis))

        currentPage.value.key++
      }

      const setNodesLayoutHidden = (hidden: boolean) => {
        selectedNodes.value
            .forEach((node) => node?.setHidden(hidden))

        currentPage.value.key++
      }

      const setWidget = (widget: Item) => {
        selectedNodes.value
            .forEach((node) => node?.setWidget(widget))

        currentPage.value.key++
      }

      const removeWidget = () => {
        selectedNodes.value
            .forEach((node) => node?.removeWidget())

        currentPage.value.key++
      }

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

      const copyNode = () => {
        copiedNode.value = getSelectedNodeOne()

        currentPage.value.key++
      }

      const cutNode = () => {
        copiedNode.value = getSelectedNodeOne()

        removeNode()
      }

      const pasteNode = () => {
        const selectedNode = getSelectedNodeOne()

        const cloned = <Node>deepClone(copiedNode.value)
        const recursive = (node: Node) => {
          node.id = generateUniqueId()
          node.nodes.forEach((child) => {
            child.parentId = node.id
            child.id = generateUniqueId()
            recursive(child)
          })
        }
        recursive(cloned)

        if (selectedNode) {
          cloned.parentId = selectedNode.id
          selectedNode.nodes.push(Node.makeNode(cloned))
        } else {
          cloned.parentId = undefined
          currentPage.value.nodes.push(Node.makeNode(cloned))
        }
        selectNodeOne(cloned.id)
        currentPage.value.key++
      }

      return {
        pages,
        loadPages,
        addPage,
        copyPage,
        removePage,

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

        setWidget,
        removeWidget,

        updateNodesWidget,

        findNode,

        getSelectedNodeOne,

        copiedNode,
        copyNode,
        cutNode,
        pasteNode,

        syncKey,
        updateSyncKey
      }
    }
)