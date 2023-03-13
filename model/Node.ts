import {generateUniqueId} from "~/util/util"
import {Item} from "~/model/Widget"

export type Marker = {
  text: string
  date: Date
}

export class Node {
  id = generateUniqueId()
  nodes: Node[] = []

  selectedResponsiveMode: ResponsiveMode = 'large'

  layout: ResponsiveNodeLayout = {
    small: {
      type: 'stack',
      direction: 'vertical',
      hidden: false
    },
    large: {
      type: 'stack',
      direction: 'vertical',
      hidden: false
    },
  }

  widget?: Item
  marker?: Marker

  constructor(public parentId?: string) {
  }

  addMarker(marker?: Marker) {
    this.marker = marker ? marker : {text: '', date: new Date()}
  }

  removeMarker() {
    this.marker = undefined
  }

  setWidget(widget: Item) {
    this.widget = widget
  }

  removeWidget() {
    this.widget = undefined
  }

  selectResponsiveMode(responsiveMode: ResponsiveMode) {
    this.selectedResponsiveMode = responsiveMode
  }

  setLayoutType(type: NodeLayoutType) {
    this.layout[this.selectedResponsiveMode].type = type

    if (type === 'grid')
      this.layout[this.selectedResponsiveMode].columns = 1

    type === 'grid'
        ? this.layout[this.selectedResponsiveMode].direction = 'vertical'
        : this.layout[this.selectedResponsiveMode].columns = 1
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

  setMaxWidth(maxWidth: string) {
    this.layout[this.selectedResponsiveMode].maxWidth = maxWidth
  }

  setMainAxis(mainAxis: MainAxis) {
    this.layout[this.selectedResponsiveMode].mainAxis = mainAxis
  }

  setCrossAxis(crossAxis: CrossAxis) {
    this.layout[this.selectedResponsiveMode].crossAxis = crossAxis
  }

  setHidden(hidden: boolean) {
    this.layout[this.selectedResponsiveMode].hidden = hidden
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
  maxWidth?: string
  mainAxis?: MainAxis
  crossAxis?: CrossAxis
  hidden: boolean
}

export type ResponsiveNodeLayout = {
  small: NodeLayout
  large: NodeLayout
}

export type ResponsiveMode = 'small' | 'large'

