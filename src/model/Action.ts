import {usePagesStore} from "../store/page.store"
import type {
  CrossAxis,
  Direction,
  MainAxis,
  Marker,
  NodeDirection,
  NodeLayoutType,
  Position,
  ResponsiveMode
} from "./Node"
import {Node} from "./Node"
import {deepClone, generateUniqueId} from "../util/util"
import {useScreenStore} from "../store/screen.store"
import type {Item} from "./Widget"

export interface Action {
  readonly actionName: string

  do: () => void,

  undo: () => void,

  redo: () => void,
}

export class AbstractAction implements Action {
  actionName = ''
  pageStore = usePagesStore()

  do(): void {
  }

  undo(): void {
  }

  redo(): void {
    this.do()
  }
}

export class AddSiblingNodeUp extends AbstractAction {

  actionName = 'AddSiblingNodeUp'
  createdNodeIds: string[] = []
  selectedIds: string[] = []

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.selectedIds = this.pageStore.selectedNodeIds
    if (this.pageStore.selectedNodeIds.length === 0) {
      const createdNode = new Node()
      createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
      this.createdNodeIds.push(createdNode.id)
      this.pageStore.currentPage.nodes.push(createdNode)
    } else {
      const selectedId = this.pageStore.selectedNodeIds[0]
      const found = this.pageStore.findNode(selectedId)
      const parent = this.pageStore.findNode(found?.parentId)
      const index = parent
          ? parent.nodes.findIndex((item) => item.id === found?.id)
          : this.pageStore.currentPage.nodes.findIndex((item) => item.id === found?.id)

      const createdNode = parent ? new Node(parent.id) : new Node()
      createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
      this.createdNodeIds.push(createdNode.id)

      parent
          ? parent.nodes.splice(index, 0, createdNode)
          : this.pageStore.currentPage.nodes.splice(index, 0, createdNode)
    }

    this.pageStore.selectedNodeIds = this.createdNodeIds
    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.createdNodeIds.forEach((id) => {
      const found = this.pageStore.findNode(id)
      const parent = this.pageStore.findNode(found?.parentId)
      parent
          ? parent.nodes = parent.nodes.filter((node) => node.id !== id)
          : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== id)
    })
    this.pageStore.selectNodeOne(this.selectedIds[0])
  }

  redo(): void {
    this.do(true)
  }

  static of(): AddSiblingNodeUp {
    return new AddSiblingNodeUp()
  }
}

export class AddSiblingNodeDown extends AbstractAction {
  actionName = 'AddSiblingNodeDown'
  createdNodeIds: string[] = []
  selectedIds: string[] = []

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.selectedIds = this.pageStore.selectedNodeIds
    if (this.pageStore.selectedNodeIds.length === 0) {
      const createdNode = new Node()
      createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
      this.createdNodeIds.push(createdNode.id)
      this.pageStore.currentPage.nodes.push(createdNode)
    } else {
      const selectedId = this.pageStore.selectedNodeIds[0]
      const found = this.pageStore.findNode(selectedId)
      const parent = this.pageStore.findNode(found?.parentId)
      const index = parent
          ? parent.nodes.findIndex((item) => item.id === found?.id)
          : this.pageStore.currentPage.nodes.findIndex((item) => item.id === found?.id)

      const createdNode = parent ? new Node(parent.id) : new Node()
      createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
      this.createdNodeIds.push(createdNode.id)

      parent
          ? parent.nodes.splice(index + 1, 0, createdNode)
          : this.pageStore.currentPage.nodes.splice(index + 1, 0, createdNode)
    }

    this.pageStore.selectedNodeIds = this.createdNodeIds
    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.createdNodeIds.forEach((id) => {
      const found = this.pageStore.findNode(id)
      const parent = this.pageStore.findNode(found?.parentId)
      parent
          ? parent.nodes = parent.nodes.filter((node) => node.id !== id)
          : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== id)
    })
    this.pageStore.selectNodeOne(this.selectedIds[0])
  }

  redo(): void {
    this.do(true)
  }

  static of(): AddSiblingNodeDown {
    return new AddSiblingNodeDown()
  }
}

export class AddChildNode extends AbstractAction {
  actionName = 'AddChildNode'
  createdNodeIds: string[] = []
  selectedIds: string[] = []

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.selectedIds = this.pageStore.selectedNodeIds
    this.pageStore.selectedNodeIds.length === 0
        ? [true].forEach(() => {
          const createdNode = new Node()
          createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
          this.createdNodeIds.push(createdNode.id)
          this.pageStore.currentPage.nodes.push(createdNode)
        })
        : this.pageStore.selectedNodeIds
            .forEach((selectedId) => {
              const found = this.pageStore.findNode(selectedId)
              if (found) {
                const createdNode = new Node(found.id)
                createdNode.id = isRedo ? this.createdNodeIds[0] : createdNode.id
                this.createdNodeIds.push(createdNode.id)
                found.nodes.push(createdNode)
              }
            })

    this.pageStore.selectedNodeIds = this.createdNodeIds
    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.createdNodeIds.forEach((id) => {
      const found = this.pageStore.findNode(id)
      const parent = this.pageStore.findNode(found?.parentId)
      parent
          ? parent.nodes = parent.nodes.filter((node) => node.id !== id)
          : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== id)
    })
    this.pageStore.selectNodeOne(this.selectedIds[0])
  }

  redo(): void {
    this.do(true)
  }

  static of(): AddChildNode {
    return new AddChildNode()
  }
}

export class AddParentNode extends AbstractAction {
  actionName = 'AddParentNode'
  createdNodeIds: string[] = []
  selectedIds: string[] = []

  constructor() {
    super()
  }

  do(): void {
    this.selectedIds = this.pageStore.selectedNodeIds

    if (this.pageStore.selectedNodeIds.length === 0) {
      const createdNode = new Node()
      this.createdNodeIds.push(createdNode.id)
      this.pageStore.currentPage.nodes.push(createdNode)
    } else {
      const selectedId = this.selectedIds[0]
      const found = this.pageStore.findNode(selectedId)
      if (found) {
        const createdNode = new Node(found.id)
        this.createdNodeIds.push(found.id)

        createdNode.widget = found.widget
        found.widget = undefined
        createdNode.nodes = found.nodes
        found.nodes = [createdNode]
        createdNode.layout = found.layout
        found.layout = {
          small: {type: 'stack', direction: 'vertical', hidden: false},
          large: {type: undefined, direction: undefined, hidden: false}
        }
      }
    }

    this.pageStore.selectedNodeIds = this.createdNodeIds
    this.pageStore.currentPage.key++
  }

  undo(): void {
    if (this.selectedIds.length === 0) {
      this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== this.createdNodeIds[0])
    } else {
      this.createdNodeIds.forEach((id) => {
        const createdNode = <Node>this.pageStore.findNode(id)
        const clonedNode = createdNode.nodes[0]
        createdNode.layout = clonedNode.layout
        createdNode.widget = clonedNode.widget
        createdNode.nodes = clonedNode.nodes
      })
      this.createdNodeIds = []
      this.pageStore.selectNodeOne(this.selectedIds[0])
    }
  }

  static of(): AddParentNode {
    return new AddParentNode()
  }
}

export class RemoveNode extends AbstractAction {
  actionName = 'RemoveNode'
  deletedNodes: { node: Node, index: number }[] = []

  constructor() {
    super()
  }

  do(): void {
    this.pageStore.selectedNodeIds.forEach((selectedId) => {
      const found = this.pageStore.findNode(selectedId)
      const parent = this.pageStore.findNode(found?.parentId)
      const foundIndex = parent
          ? parent.nodes.findIndex((item) => item.id === found?.id)
          : this.pageStore.currentPage.nodes.findIndex((item) => item.id === found?.id)


      const deletedNode = parent
          ? parent.nodes.splice(foundIndex, 1)[0]
          : this.pageStore.currentPage.nodes.splice(foundIndex, 1)[0]

      const deletedData = {index: foundIndex, node: deletedNode}

      this.deletedNodes.push(deletedData)
    })

    if (this.deletedNodes.length > 1)
      this.pageStore.selectedNodeIds = []
    else {
      const parent = this.pageStore.findNode(this.deletedNodes[0].node?.parentId)
      parent
          ? this.pageStore.selectedNodeIds = parent.nodes.length > 0
              ? [parent.nodes[Math.max(0, (this.deletedNodes[0]?.index || 0) - 1)].id]
              : [parent.id]
          : this.pageStore.selectedNodeIds = this.pageStore.currentPage.nodes.length > 0
              ? [this.pageStore.currentPage.nodes[Math.max(0, (this.deletedNodes[0]?.index || 0) - 1)].id]
              : []
    }

    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.deletedNodes.reverse().forEach((deletedNode) => {
      const parent = this.pageStore.findNode(deletedNode.node?.parentId)

      if (parent)
        parent.nodes.splice(deletedNode.index, 0, deletedNode.node)
      else
        this.pageStore.currentPage.nodes.splice(deletedNode.index, 0, deletedNode.node)
    })
    this.pageStore.selectedNodeIds = this.deletedNodes.map((item) => item.node.id)
    this.deletedNodes = []
  }

  static of(): RemoveNode {
    return new RemoveNode()
  }
}

export class RemoveParentNode extends AbstractAction {
  actionName = 'RemoveParentNode'
  selectedNodeId?: string
  deletedNodes: { node: Node, index: number }[] = []

  constructor() {
    super()
  }

  do(): void {
    const selectedNode = <Node>this.pageStore.getSelectedNodeOne()
    this.selectedNodeId = selectedNode.id
    const parentNode = this.pageStore.findNode(this.pageStore.getSelectedNodeOne()?.parentId)
    const grandParentNode = this.pageStore.findNode(parentNode?.parentId)

    if (grandParentNode) {
      const foundIndex = grandParentNode.nodes.findIndex((node) => node.id === parentNode?.id)
      const deletedNodes = grandParentNode.nodes.splice(foundIndex, 1, selectedNode)
      this.deletedNodes.push({node: deletedNodes[0], index: foundIndex})
      selectedNode.parentId = grandParentNode.id
    } else {
      const foundIndex = this.pageStore.currentPage.nodes.findIndex((node) => node.id === parentNode?.id)
      const deletedNodes = this.pageStore.currentPage.nodes.splice(foundIndex, 1, selectedNode)
      this.deletedNodes.push({node: deletedNodes[0], index: foundIndex})
      selectedNode.parentId = undefined
    }

    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.deletedNodes.forEach((deletedNode) => {
      const selected = <Node>this.pageStore.findNode(this.selectedNodeId)

      if (deletedNode.node.parentId) {
        const parent = <Node>this.pageStore.findNode(deletedNode.node.parentId)
        selected.parentId = deletedNode.node.id
        parent.nodes.splice(deletedNode.index, 1, deletedNode.node)
      } else {
        selected.parentId = deletedNode.node.id
        this.pageStore.currentPage.nodes.splice(deletedNode.index, 1, deletedNode.node)
      }
    })
  }

  static of(): RemoveParentNode {
    return new RemoveParentNode()
  }
}

export class PasteNode extends AbstractAction {
  actionName = 'PasteNode'
  selectedNodeId?: string
  createdNode?: Node

  constructor() {
    super()
  }

  do(): void {
    const selectedNode = this.pageStore.getSelectedNodeOne()

    this.selectedNodeId = selectedNode?.id
    const cloned = <Node>deepClone(this.pageStore.copiedNode)

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
      this.pageStore.currentPage.nodes.push(Node.makeNode(cloned))
    }
    this.createdNode = <Node>deepClone(cloned)

    this.pageStore.selectNodeOne(cloned.id)
    this.pageStore.copyNode()
    this.pageStore.currentPage.key++
    this.pageStore.updateNodesWidget()
  }

  undo(): void {
    const createdNode = this.createdNode
    const parent = <Node>this.pageStore.findNode(createdNode?.parentId)
    parent
        ? parent.nodes = parent.nodes.filter((node) => node.id !== createdNode?.id)
        : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== createdNode?.id)

    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    const selectedNode = this.pageStore.findNode(this.selectedNodeId)

    const cloned = <Node>deepClone(this.createdNode)

    if (selectedNode) {
      cloned.parentId = selectedNode.id
      selectedNode.nodes.push(Node.makeNode(cloned))
    } else {
      cloned.parentId = undefined
      this.pageStore.currentPage.nodes.push(Node.makeNode(cloned))
    }
    this.pageStore.selectNodeOne(cloned.id)
    this.pageStore.copyNode()
    this.pageStore.currentPage.key++
    this.pageStore.updateNodesWidget()
  }

  static of(): PasteNode {
    return new PasteNode()
  }
}

export class SelectResponsiveMode extends AbstractAction {
  actionName = 'SelectResponsiveMode'
  savedResponsiveMode?: ResponsiveMode
  screenStore = useScreenStore()
  selectedNodeId?: string

  constructor(private responsiveMode: ResponsiveMode) {
    super()
  }

  do(redo?: boolean): void {
    this.selectedNodeId = redo
        ? this.selectedNodeId
        : this.pageStore.selectedNodes[0]?.id
    this.savedResponsiveMode = this.pageStore.selectedNodes[0]?.selectedResponsiveMode
    this.pageStore.selectedNodes[0]?.selectResponsiveMode(this.responsiveMode)
    const width = this.responsiveMode === 'small' ? '33.33%' : '100%'
    this.screenStore.setScreenSize('width', width)
    this.pageStore.currentPage.key++
  }

  undo(): void {
    this.pageStore.findNode(this.selectedNodeId)?.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    this.pageStore.currentPage.key++
    const width = this.savedResponsiveMode === 'small' ? '33.33%' : '100%'
    this.screenStore.setScreenSize('width', width)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(responsiveMode: ResponsiveMode): SelectResponsiveMode {
    return new SelectResponsiveMode(responsiveMode)
  }
}

export class SetNodesLayoutType extends AbstractAction {
  actionName = 'SetNodesLayoutType'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedType?: NodeLayoutType

  constructor(private type: NodeLayoutType) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedType = node.layout[node.selectedResponsiveMode].type

    node.setLayoutType(this.type)
    if (this.type === 'stack') node.setLayoutStackDirection('vertical')

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setLayoutType(<NodeLayoutType>this.savedType)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(type: NodeLayoutType): SetNodesLayoutType {
    return new SetNodesLayoutType(type)
  }
}

export class SetNodesLayoutStackDirection extends AbstractAction {
  actionName = 'SetNodesLayoutStackDirection'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedDirection?: NodeDirection

  constructor(private direction: NodeDirection) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedDirection = node.layout[node.selectedResponsiveMode].direction

    node.setLayoutStackDirection(this.direction)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setLayoutStackDirection(<NodeDirection>this.savedDirection)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(direction: NodeDirection): SetNodesLayoutStackDirection {
    return new SetNodesLayoutStackDirection(direction)
  }
}

export class SetNodesLayoutGridColumns extends AbstractAction {
  actionName = 'SetNodesLayoutStackDirection'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedColumns?: number

  constructor(private columns: number) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedColumns = node.layout[node.selectedResponsiveMode].columns

    node.setLayoutGridColumns(this.columns)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setLayoutGridColumns(<number>this.columns)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(columns: number): SetNodesLayoutGridColumns {
    return new SetNodesLayoutGridColumns(columns)
  }
}

export class SetNodesLayoutGap extends AbstractAction {
  actionName = 'SetNodesLayoutGap'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedGap?: string

  constructor(private gap: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedGap = node.layout[node.selectedResponsiveMode].gap

    node.setLayoutGap(this.gap)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setLayoutGap(<string>this.savedGap)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(gap: string): SetNodesLayoutGap {
    return new SetNodesLayoutGap(gap)
  }
}

export class SetNodesLayoutWidth extends AbstractAction {
  actionName = 'SetNodesLayoutWidth'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedWidth?: string

  constructor(private width: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedWidth = node.layout[node.selectedResponsiveMode].width

    node.setWidth(this.width)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setWidth(<string>this.savedWidth)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(width: string): SetNodesLayoutWidth {
    return new SetNodesLayoutWidth(width)
  }
}

export class SetNodesLayoutMaxWidth extends AbstractAction {
  actionName = 'SetNodesLayoutMaxWidth'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedMaxWidth?: string

  constructor(private maxWidth: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedMaxWidth = node.layout[node.selectedResponsiveMode].maxWidth

    node.setMaxWidth(this.maxWidth)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setMaxWidth(<string>this.savedMaxWidth)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(maxWidth: string): SetNodesLayoutMaxWidth {
    return new SetNodesLayoutMaxWidth(maxWidth)
  }
}

export class SetNodesLayoutHeight extends AbstractAction {
  actionName = 'SetNodesLayoutHeight'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedHeight?: string

  constructor(private height: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedHeight = node.layout[node.selectedResponsiveMode].height

    node.setHeight(this.height)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setHeight(<string>this.savedHeight)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(height: string): SetNodesLayoutHeight {
    return new SetNodesLayoutHeight(height)
  }
}

export class SetNodesLayoutMainAxis extends AbstractAction {
  actionName = 'SetNodesLayoutMainAxis'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedMainAxis?: MainAxis

  constructor(private mainAxis: MainAxis) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedMainAxis = node.layout[node.selectedResponsiveMode].mainAxis

    node.setMainAxis(this.mainAxis)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setMainAxis(<MainAxis>this.savedMainAxis)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(mainAxis: MainAxis): SetNodesLayoutMainAxis {
    return new SetNodesLayoutMainAxis(mainAxis)
  }
}

export class SetNodesLayoutCrossAxis extends AbstractAction {
  actionName = 'SetNodesLayoutCrossAxis'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedCrossAxis?: CrossAxis

  constructor(private crossAxis: CrossAxis) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedCrossAxis = node.layout[node.selectedResponsiveMode].crossAxis

    node.setCrossAxis(this.crossAxis)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setCrossAxis(<CrossAxis>this.savedCrossAxis)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(crossAxis: CrossAxis): SetNodesLayoutCrossAxis {
    return new SetNodesLayoutCrossAxis(crossAxis)
  }
}

export class SetNodesLayoutPosition extends AbstractAction {
  actionName = 'SetNodesLayoutPosition'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedPosition?: CrossAxis

  constructor(private position: Position) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedPosition = node.layout[node.selectedResponsiveMode].crossAxis

    node.setPosition(this.position)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setPosition(<Position>this.savedPosition)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(position: Position): SetNodesLayoutPosition {
    return new SetNodesLayoutPosition(position)
  }
}

export class SetNodesLayoutHidden extends AbstractAction {
  actionName = 'SetNodesLayoutHidden'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedHidden?: boolean

  constructor(private hidden: boolean) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedHidden = node.layout[node.selectedResponsiveMode].hidden

    node.setHidden(this.hidden)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setHidden(<boolean>this.savedHidden)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(hidden: boolean): SetNodesLayoutHidden {
    return new SetNodesLayoutHidden(hidden)
  }
}

export class SetNodesLayoutPadding extends AbstractAction {
  actionName = 'SetNodesLayoutHidden'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedValue?: string

  constructor(private direction: Direction,
              private value: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedValue = node.layout[node.selectedResponsiveMode][this.directionToField(this.direction)]

    node.setPadding(this.direction, this.value)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setPadding(this.direction, this.savedValue)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  private directionToField(direction: Direction): 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingBottom' {
    return direction === 'left'
        ? 'paddingLeft'
        : direction === 'right'
            ? 'paddingRight'
            : direction === 'top'
                ? 'paddingTop'
                : 'paddingBottom'
  }

  static of(direction: Direction, value: string): SetNodesLayoutPadding {
    return new SetNodesLayoutPadding(direction, value)
  }
}

export class SetNodesLayoutInset extends AbstractAction {
  actionName = 'SetNodesLayoutInset'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedValue?: string

  constructor(private direction: Direction,
              private value: string) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedValue = node.layout[node.selectedResponsiveMode][this.directionToField(this.direction)]

    node.setInset(this.direction, this.value)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setInset(this.direction, this.savedValue)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  private directionToField(direction: Direction): 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingBottom' {
    return direction === 'left'
        ? 'paddingLeft'
        : direction === 'right'
            ? 'paddingRight'
            : direction === 'top'
                ? 'paddingTop'
                : 'paddingBottom'
  }

  static of(direction: Direction, value: string): SetNodesLayoutInset {
    return new SetNodesLayoutInset(direction, value)
  }
}

export class SetNodesTransparent extends AbstractAction {
  actionName = 'SetNodesTransparent'
  selectedNodeId?: string
  savedResponsiveMode?: ResponsiveMode
  savedValue?: boolean

  constructor(private value: boolean) {
    super()
  }

  do(isRedo?: boolean): void {
    const node = isRedo
        ? <Node>this.pageStore.findNode(this.selectedNodeId)
        : <Node>this.pageStore.selectedNodes[0]

    this.selectedNodeId = node.id
    this.savedResponsiveMode = node.selectedResponsiveMode
    this.savedValue = node.layout[node.selectedResponsiveMode].transparent

    node.setTransparent(this.value)

    this.pageStore.currentPage.key++
  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.selectedNodeId)
    found.selectResponsiveMode(<ResponsiveMode>this.savedResponsiveMode)
    found.setTransparent(this.savedValue)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.do(true)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(value: boolean): SetNodesTransparent {
    return new SetNodesTransparent(value)
  }
}

export class SetWidget extends AbstractAction {
  actionName = 'SetWidget'
  selectedNodeIds?: string[]
  savedWidgets?: { nodeId?: string, widget?: Item }[]

  constructor(private widget: Item) {
    super()
  }

  do(isRedo?: boolean): void {
    this.savedWidgets = isRedo
        ? this.savedWidgets
        : this.pageStore.selectedNodes
            .map((node) => ({
              nodeId: node?.id,
              widget: node?.widget
            }))

    this.savedWidgets
        ?.map((data) => data.nodeId)
        .filter((value): value is string => !!value)
        .forEach((id) => {
          const found = <Node>this.pageStore.findNode(id)
          found.setWidget(this.widget)
        })

    this.pageStore.selectNodeOne()
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  undo(): void {
    this.savedWidgets?.forEach((data) => {
      const found = <Node>this.pageStore.findNode(data.nodeId)
      data.widget ? found.setWidget(data.widget) : found.removeWidget()
    })
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  redo(): void {
    this.do(true)
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  static of(widget: Item): SetWidget {
    return new SetWidget(widget)
  }
}

export class RemoveWidget extends AbstractAction {
  actionName = 'RemoveWidget'
  selectedNodeIds?: string[]
  savedWidgets?: { nodeId?: string, widget?: Item }[]

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.savedWidgets = isRedo
        ? this.savedWidgets
        : this.pageStore.selectedNodes
            .map((node) => ({
              nodeId: node?.id,
              widget: node?.widget
            }))

    this.savedWidgets
        ?.map((data) => data.nodeId)
        .filter((value): value is string => !!value)
        .forEach((id) => {
          const found = <Node>this.pageStore.findNode(id)
          found.removeWidget()
        })

    this.pageStore.selectNodeOne()
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  undo(): void {
    this.savedWidgets?.forEach((data) => {
      const found = <Node>this.pageStore.findNode(data.nodeId)
      data.widget ? found.setWidget(data.widget) : found.removeWidget()
    })
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  redo(): void {
    this.do(true)
    this.savedWidgets?.forEach((data) => this.pageStore.selectNodeMany(data.nodeId || ''))
  }

  static of(): RemoveWidget {
    return new RemoveWidget()
  }
}

export class AddMarker extends AbstractAction {
  actionName = 'AddMarker'
  selectedNodeId?: string
  savedMarker?: Marker

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.selectedNodeId = this.pageStore.getSelectedNodeOne()?.id
    this.pageStore.getSelectedNodeOne()?.addMarker()
  }

  undo(): void {
    this.savedMarker = this.pageStore.findNode(this.selectedNodeId)?.marker
    this.pageStore.findNode(this.selectedNodeId)?.removeMarker()
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.pageStore.findNode(this.selectedNodeId)?.addMarker(this.savedMarker)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(): AddMarker {
    return new AddMarker()
  }
}

export class RemoveMarker extends AbstractAction {
  actionName = 'AddMarker'
  selectedNodeId?: string
  savedMarker?: Marker

  constructor() {
    super()
  }

  do(isRedo?: boolean): void {
    this.selectedNodeId = this.pageStore.getSelectedNodeOne()?.id
    this.savedMarker = this.pageStore.getSelectedNodeOne()?.marker
    this.pageStore.getSelectedNodeOne()?.removeMarker()
  }

  undo(): void {
    this.pageStore.findNode(this.selectedNodeId)?.addMarker(this.savedMarker)
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  redo(): void {
    this.pageStore.findNode(this.selectedNodeId)?.removeMarker()
    this.pageStore.selectNodeOne(this.selectedNodeId)
  }

  static of(): RemoveMarker {
    return new RemoveMarker()
  }
}

export class DragNode extends AbstractAction {
  actionName = 'DragNode'
  nodeId?: string
  parentId?: string
  oldIndex?: number
  newIndex?: number
  originalParentId?: string

  constructor(dragNodeRaw?: DragNode) {
    super()
    if (dragNodeRaw) {
      this.nodeId = dragNodeRaw.nodeId
      this.parentId = dragNodeRaw.parentId
      this.oldIndex = dragNodeRaw.oldIndex
      this.newIndex = dragNodeRaw.newIndex
    }
  }

  do(isRedo?: boolean): void {
    if (!this.parentId) {
      const found = <Node>this.pageStore.findNode(this.nodeId)
      const parent = this.pageStore.findNode(found.parentId)
      if (parent) {
        parent.nodes = parent.nodes.filter((node) => node.id !== found.id)
        this.originalParentId = parent.id
      }
      found.parentId = ''
      this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== this.nodeId)
      this.pageStore.currentPage.nodes.splice(this.newIndex || 0, 0, found)
    } else {
      const found = <Node>this.pageStore.findNode(this.nodeId)
      const parent = this.pageStore.findNode(found.parentId)
      parent
          ? parent.nodes = parent.nodes.filter((node) => node.id !== found.id)
          : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== this.nodeId)

      const parentId = this.parentId.replace(/drag_/gi, '')
      const foundParent = this.pageStore.findNode(parentId)

      if (foundParent) {
        this.originalParentId = found.parentId
        found.parentId = this.parentId?.replace(/drag_/gi, '')
        foundParent.nodes = foundParent.nodes.filter((node) => node.id !== this.nodeId)
        foundParent.nodes.splice(this.newIndex || 0, 0, found)
      }
    }
    this.pageStore.selectNodeOne(this.nodeId)

  }

  undo(): void {
    const found = <Node>this.pageStore.findNode(this.nodeId)
    const parent = this.pageStore.findNode(found?.parentId)
    if (parent) {
      parent.nodes = parent.nodes.filter((node) => node.id !== this.nodeId)
      const originalParent = this.pageStore.findNode(this.originalParentId)
      originalParent
          ? originalParent.nodes.splice(this.oldIndex || 0, 0, found)
          : this.pageStore.currentPage.nodes.splice(this.oldIndex || 0, 0, found)
      this.originalParentId = found.parentId
      found.parentId = originalParent?.id || ''
    } else {
      this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== this.nodeId)
      const originalParent = this.pageStore.findNode(this.originalParentId)
      originalParent
          ? originalParent.nodes.splice(this.oldIndex || 0, 0, found)
          : this.pageStore.currentPage.nodes.splice(this.oldIndex || 0, 0, found)
      this.originalParentId = found.parentId
      found.parentId = originalParent?.id || ''
    }
    this.pageStore.selectNodeOne(this.nodeId)

  }

  redo(): void {
    const found = <Node>this.pageStore.findNode(this.nodeId)
    const parent = this.pageStore.findNode(found?.parentId)

    parent
        ? parent.nodes = parent.nodes.filter((node) => node.id !== this.nodeId)
        : this.pageStore.currentPage.nodes = this.pageStore.currentPage.nodes.filter((node) => node.id !== this.nodeId)

    const originalParent = this.pageStore.findNode(this.originalParentId)
    this.originalParentId = parent?.id
    originalParent
        ? originalParent.nodes.splice(this.newIndex || 0, 0, found)
        : this.pageStore.currentPage.nodes.splice(this.newIndex || 0, 0, found)

    found.parentId = originalParent?.id || ''
    this.pageStore.selectNodeOne(this.nodeId)
  }

  setNodeId(id: string): this {
    this.nodeId = id
    return this
  }

  setOldIndex(index: number): this {
    this.oldIndex = index
    return this
  }

  setParentId(id: string): this {
    this.parentId = id
    return this
  }

  setNewIndex(index: number): this {
    this.newIndex = index
    return this
  }

  static of(dragNodeRaw?: DragNode): DragNode {
    return new DragNode(dragNodeRaw)
  }
}