import type {Group} from "../model/Widget"
import type {Direction, Node, ResponsiveMode} from "../model/Node"

const getScreenSize = (responsiveMode: ResponsiveMode) => responsiveMode === 'small' ? '0px' : '768px'

export const generateCss = (nodes: Node[],
                            groups: Group[],
                            isShowHidden = false): string =>
    generateCoreCss(isShowHidden)
    + `\n`
    + generateLayoutCss(nodes)
    + `\n`
    + generateWidgetCss(groups)

const generateCoreCss = (isShowHidden: boolean) => {
  return `
.node {
  width: 100%;
  border-collapse: collapse;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.node > div {
  width: 100%;
}

@media (min-width: 0px) {
  .small\\:type-stack {
      display: flex;
  }

  .small\\:direction-horizontal {
      flex-direction: row;
  }

  .small\\:direction-vertical {
      flex-direction: column;
  }

  .small\\:type-grid {
      display: grid;
  }

  .small\\:mainAxis-start {
      justify-content: start;
  }
  
  .small\\:mainAxis-center {
      justify-content: center;
  }
  
  .small\\:mainAxis-end {
      justify-content: end;
  }
  
  .small\\:mainAxis-between {
      justify-content: space-between;
  }
  
  .small\\:crossAxis-start {
      align-items: start;
  }
  
  .small\\:crossAxis-center {
      align-items: center;
  }
  
  .small\\:crossAxis-end {
      align-items: end;
  }
  
  .node.small\\:position-relative {
      position: relative;
  }
  
  .node.small\\:position-absolute {
      position: absolute;
  }
  
  .node.small\\:position-sticky {
      position: sticky;
  }
  
  .node.small\\:position-fixed {
      position: fixed;
  }
  
  .node.small\\:transparent {
      background: #ffffff;
  }
}

@media (min-width:0) and (max-width:767px) {
  .small\\:hidden-true {
      ${isShowHidden ? 'opacity: .3;' : 'display: none;'}
  }
}


@media (min-width: 768px) {
  .large\\:type-stack {
      display: flex
  }

  .large\\:direction-horizontal {
      flex-direction: row;
  }

  .large\\:direction-vertical {
      flex-direction: column;
  }

  .large\\:type-grid {
      display: grid;
  }
  
  .large\\:mainAxis-start {
      justify-content: start;
  }
  
  .large\\:mainAxis-center {
      justify-content: center;
  }
  
  .large\\:mainAxis-end {
      justify-content: end;
  }
  
  .large\\:mainAxis-between {
      justify-content: space-between;
  }
  
  .large\\:crossAxis-start {
      align-items: start;
  }
  
  .large\\:crossAxis-center {
      align-items: center;
  }
  
  .large\\:crossAxis-end {
      align-items: end;
  }
  
  .large\\:hidden-true {
      ${isShowHidden ? 'opacity: .3;' : 'display: none;'}
  }
  
  .node.large\\:position-relative {
      position: relative;
  }
  
  .node.large\\:position-absolute {
      position: absolute;
  }
  
  .node.large\\:position-sticky {
      position: sticky;
  }
  
  .node.large\\:position-fixed {
      position: fixed;
  }
  
  .large\\:transparent {
      background: #ffffff;
  }
}
`
}

export const generateDragAreaCss = () => {
  return `
.drag-area {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

@media (min-width: 0px) {
  .drag-area.small\\:type-stack {
      display: flex;
  }

  .drag-area.small\\:direction-horizontal {
      flex-direction: row;
  }

  .drag-area.small\\:direction-vertical {
      flex-direction: column;
  }

  .drag-area.small\\:type-grid {
      display: grid;
  }

  .drag-area.small\\:mainAxis-start {
      justify-content: start;
  }
  
  .drag-area.small\\:mainAxis-center {
      justify-content: center;
  }
  
  .drag-area.small\\:mainAxis-end {
      justify-content: end;
  }
  
  .drag-area.small\\:mainAxis-between {
      justify-content: space-between;
  }
  
  .drag-area.small\\:crossAxis-start {
      align-items: start;
  }
  
  .drag-area.small\\:crossAxis-center {
      align-items: center;
  }
  
  .drag-area.small\\:crossAxis-end {
      align-items: end;
  }
}

@media (min-width: 768px) {
  .drag-area.large\\:type-stack {
      display: flex
  }

  .drag-area.large\\:direction-horizontal {
      flex-direction: row;
  }

  .drag-area.large\\:direction-vertical {
      flex-direction: column;
  }

  .drag-area.large\\:type-grid {
      display: grid;
  }
  
  .drag-area.large\\:mainAxis-start {
      justify-content: start;
  }
  
  .drag-area.large\\:mainAxis-center {
      justify-content: center;
  }
  
  .drag-area.large\\:mainAxis-end {
      justify-content: end;
  }
  
  .drag-area.large\\:mainAxis-between {
      justify-content: space-between;
  }
  
  .drag-area.large\\:crossAxis-start {
      align-items: start;
  }
  
  .drag-area.large\\:crossAxis-center {
      align-items: center;
  }
  
  .drag-area.large\\:crossAxis-end {
      align-items: end;
  }
}
`
}

const generateLayoutCss = (nodes: Node[]) => {
  return generateGap(nodes, 'small')
      + generateGap(nodes, 'large')
      + generateColumns(nodes, 'small')
      + generateColumns(nodes, 'large')
      + generateWidth(nodes, 'small')
      + generateWidth(nodes, 'large')
      + generateHeight(nodes, 'small')
      + generateHeight(nodes, 'large')
      + generateMaxWidth(nodes, 'small')
      + generateMaxWidth(nodes, 'large')
      + generatePadding(nodes, 'small', 'left')
      + generatePadding(nodes, 'small', 'top')
      + generatePadding(nodes, 'small', 'right')
      + generatePadding(nodes, 'small', 'bottom')
      + generatePadding(nodes, 'large', 'left')
      + generatePadding(nodes, 'large', 'top')
      + generatePadding(nodes, 'large', 'right')
      + generatePadding(nodes, 'large', 'bottom')
      + generateInset(nodes, 'small', 'left')
      + generateInset(nodes, 'small', 'top')
      + generateInset(nodes, 'small', 'right')
      + generateInset(nodes, 'small', 'bottom')
      + generateInset(nodes, 'large', 'left')
      + generateInset(nodes, 'large', 'top')
      + generateInset(nodes, 'large', 'right')
      + generateInset(nodes, 'large', 'bottom')
}

const generateWidgetCss = (groups: Group[]) => {
  return groups
      .map((group) => group.items)
      .flat()
      .reduce((acc, current) => {
        const newline = acc ? '\n\n' : ''
        return acc + newline + current.css
      }, '')
}

const generateGap = (nodes: Node[],
                     responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode].gap
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:gap-${current} {
    gap: ${current};
  }
}
`, '')
}

const generateColumns = (nodes: Node[],
                         responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode].columns
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:columns-${current} {
    grid-template-columns: repeat(${current}, 1fr);
  }
}
`, '')
}

const generateWidth = (nodes: Node[],
                       responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode].width
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')
    return acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:width-${convertedCurrent} {
    width: ${current};
  }
}
`
  }, '')
}

const generateHeight = (nodes: Node[],
                        responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode].height
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:height-${convertedCurrent} {
    height: ${current};
  }
}
`
  }, '')
}

const generateMaxWidth = (nodes: Node[],
                          responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode].maxWidth
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:maxWidth-${convertedCurrent} {
    max-width: ${current};
  }
}
`
  }, '')
}

const generatePadding = (nodes: Node[],
                         responsiveMode: ResponsiveMode,
                         direction: Direction) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode][directionToPaddingField(direction)]
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:${flatCapital(directionToPaddingField(direction))}-${convertedCurrent} {
    ${flatCapital(directionToPaddingField(direction))}: ${current};
  }
}
`
  }, '')
}

const generateInset = (nodes: Node[],
                       responsiveMode: ResponsiveMode,
                       direction: Direction) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach((node) => {
      const value = <string | undefined>node.layout[responsiveMode][direction]
      if (value && !result.includes(value))
        result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return acc + `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:${direction}-${convertedCurrent} {
    ${direction}: ${current};
  }
}
`
  }, '')
}


const directionToPaddingField = (direction: Direction) => direction === 'left'
    ? 'paddingLeft'
    : direction === 'right'
        ? 'paddingRight'
        : direction === 'top'
            ? 'paddingTop'
            : 'paddingBottom'

const flatCapital = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)