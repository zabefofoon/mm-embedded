import {defineStore} from "pinia"
import {computed, ref} from "#imports"
import {generateUniqueId} from "~/util/util"

export type NodeDirection = 'horizontal' | 'vertical'

export type NodeLayoutType = 'stack' | 'grid'

export type MainAxis = 'start' | 'center' | 'end' | 'between'
export type CrossAxis = 'start' | 'center' | 'end'

export type NodeLayout = {
  type?: NodeLayoutType
  direction?: NodeDirection
  columns?: number
  gap?: string
  width?: string
  height?: string
  mainAxis?: MainAxis
  crossAxis?: CrossAxis
}

export type ResponsiveNodeLayout = {
  small: NodeLayout
  large: NodeLayout
}

export type ResponsiveMode = 'small' | 'large'

export class Node {
  id = generateUniqueId()
  nodes: Node[] = []

  selectedResponsiveMode: ResponsiveMode = 'small'

  layout: ResponsiveNodeLayout = {
    small: {
      type: 'stack',
      direction: 'vertical'
    },
    large: {
      type: undefined,
      direction: undefined
    }
  }

  constructor(public parentId?: string) {
  }

  selectResponsiveMode(responsiveMode: ResponsiveMode) {
    this.selectedResponsiveMode = responsiveMode
  }

  setLayoutType(type: NodeLayoutType) {
    this.layout[this.selectedResponsiveMode].type = type

    type === 'grid'
        ? this.layout[this.selectedResponsiveMode].direction = undefined
        : this.layout[this.selectedResponsiveMode].columns = undefined
  }

  setLayoutStackDirection(direction: NodeDirection) {
    this.layout[this.selectedResponsiveMode].direction = direction
  }

  setLayoutGridColumns(columns: number) {
    this.layout[this.selectedResponsiveMode].columns = columns
  }

  setLayoutGap(gap: string) {
    this.layout[this.selectedResponsiveMode].gap = gap
  }

  setWidth(width: string) {
    this.layout[this.selectedResponsiveMode].width = width
  }

  setHeight(height: string) {
    this.layout[this.selectedResponsiveMode].height = height
  }

  setMainAxis(mainAxis: MainAxis) {
    this.layout[this.selectedResponsiveMode].mainAxis = mainAxis
  }

  setCrossAxis(crossAxis: CrossAxis) {
    this.layout[this.selectedResponsiveMode].crossAxis = crossAxis
  }

  static makeNode(node: Node) {
    return Object.assign(new Node(), node)
  }

  static makeNodes(nodes: Node[]) {
    const recursive = (nodes: Node[]) => {
      return nodes.map((node) => {
        const created = Node.makeNode(node)
        created.nodes = recursive(node.nodes)
        return created
      })
    }
    return recursive(nodes)
  }
}

export type PageData = {
  key: number
  nodes: Node[]
  selectedIds: string[]
}

export const usePagesStore = defineStore('pages', () => {
      const pageData = ref<PageData>({
        key: 0,
        nodes: [],
        selectedIds: []
      })

      const selectedNodes = computed(() => pageData.value.selectedIds.map((id) => findNode(id)))

      const setPageData = (data: Partial<PageData>) => {
        pageData.value.key++

        pageData.value.key = <number>data.key
        pageData.value.nodes = Node.makeNodes(<Node[]>data.nodes)

        pageData.value.selectedIds = <string[]>data.selectedIds
      }

      const addSiblingNode = () => {
        let createdNodeIds: string[] = []

        pageData.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              pageData.value.nodes.push(createdNode)
            })
            : pageData.value.selectedIds.forEach((selectedId) => {

              const found = findNode(selectedId)
              const parent = findNode(found?.parentId)
              const index = parent
                  ? parent.nodes.findIndex((item) => item.id === found?.id)
                  : pageData.value.nodes.findIndex((item) => item.id === found?.id)

              const createdNode = parent ? new Node(parent.id) : new Node()
              createdNodeIds.push(createdNode.id)

              parent
                  ? parent.nodes.splice(index + 1, 0, createdNode)
                  : pageData.value.nodes.splice(index + 1, 0, createdNode)
            })

        pageData.value.selectedIds = createdNodeIds
        pageData.value.key++
      }

      const addChildNode = () => {
        let createdNodeIds: string[] = []

        pageData.value.selectedIds.length === 0
            ? [true].forEach(() => {
              const createdNode = new Node()
              createdNodeIds.push(createdNode.id)
              pageData.value.nodes.push(createdNode)
            })
            : pageData.value.selectedIds.forEach((selectedId) => {
              const found = findNode(selectedId)
              if (found) {
                const createdNode = new Node(found.id)
                createdNodeIds.push(createdNode.id)
                found.nodes.push(createdNode)
              }
            })

        pageData.value.selectedIds = createdNodeIds
        pageData.value.key++
      }

      const removeNode = () => {
        const deletedNodes: Node[] = []
        let deletedIndex = 0
        pageData.value.selectedIds.forEach((selectedId) => {
          const found = findNode(selectedId)
          const parent = findNode(found?.parentId)
          const index = parent
              ? parent.nodes.findIndex((item) => item.id === found?.id)
              : pageData.value.nodes.findIndex((item) => item.id === found?.id)

          deletedIndex = index

          const deletedNode = parent
              ? parent.nodes.splice(index, 1)[0]
              : pageData.value.nodes.splice(index, 1)[0]

          deletedNodes.push(deletedNode)
        })

        if (deletedNodes.length > 1)
          pageData.value.selectedIds = []
        else {
          const parent = findNode(deletedNodes[0].parentId)

          parent
              ? pageData.value.selectedIds = parent.nodes.length > 0
                  ? [parent.nodes[Math.max(0, deletedIndex - 1)].id]
                  : [parent.id]
              : pageData.value.selectedIds = pageData.value.nodes.length > 0
                  ? [pageData.value.nodes[Math.max(0, deletedIndex - 1)].id]
                  : []
        }

        pageData.value.key++
      }

      const findNode = (id?: string): Node | undefined => {
        let found

        const search = (nodes: Node[]) => {
          if (nodes.length > 0)
            nodes.forEach((node) => {
              if (id === node.id)
                found = node
              else if (node.nodes.length > 0)
                search(node.nodes)
            })
        }
        search(pageData.value.nodes)
        return found
      }

      const selectResponsiveMode = (responsiveMode: ResponsiveMode) => {
        selectedNodes.value[0]?.selectResponsiveMode(responsiveMode)
        pageData.value.key++
      }

      const selectNodeOne = (id?: string) => {
        pageData.value.selectedIds = id === undefined ? [] : [id]

        pageData.value.key++
      }

      const setNodesLayoutType = (type: NodeLayoutType) => {
        selectedNodes.value
            .forEach((node) => {
              node?.setLayoutType(type)

              if (type === 'stack')
                node?.setLayoutStackDirection('vertical')
            })

        pageData.value.key++
      }

      const setNodesLayoutStackDirection = (direction: NodeDirection) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutStackDirection(direction))

        pageData.value.key++
      }

      const setNodesLayoutGridColumns = (columns: number) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutGridColumns(columns))

        pageData.value.key++
      }

      const setNodesLayoutGap = (gap: string) => {
        selectedNodes.value
            .forEach((node) => node?.setLayoutGap(gap))

        pageData.value.key++
      }

      const setNodesLayoutWidth = (width: string) => {
        selectedNodes.value
            .forEach((node) => node?.setWidth(width))
        pageData.value.key++
      }

      const setNodesLayoutHeight = (height: string) => {
        selectedNodes.value
            .forEach((node) => node?.setHeight(height))

        pageData.value.key++
      }

      const setNodesLayoutMainAxis = (mainAxis: MainAxis) => {
        selectedNodes.value
            .forEach((node) => node?.setMainAxis(mainAxis))
        pageData.value.key++
      }

      const setNodesLayoutCrossAxis = (crossAxis: CrossAxis) => {
        selectedNodes.value
            .forEach((node) => node?.setCrossAxis(crossAxis))

        pageData.value.key++
      }

      return {
        pageData,
        setPageData,

        selectedNodes,

        addSiblingNode,
        addChildNode,
        removeNode,

        setNodesLayoutType,
        setNodesLayoutStackDirection,
        setNodesLayoutGridColumns,
        setNodesLayoutGap,
        selectResponsiveMode,
        selectNodeOne,
        setNodesLayoutWidth,
        setNodesLayoutHeight,
        setNodesLayoutMainAxis,
        setNodesLayoutCrossAxis,

        findNode
      }
    }
)