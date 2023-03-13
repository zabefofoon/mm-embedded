import {Group} from "~/model/Widget"
import {Direction, Node, ResponsiveMode} from "~/model/Node"

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
}

@media (min-width:0) and (max-width:767px) {
  .small\\:hidden-true {
      ${isShowHidden ? 'opacity: .3;' : 'display: none;'}
  }
    
  .small\\:hidden-false {
      ${isShowHidden ? 'opacity: 1;' : ''}
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
  
  .large\\:hidden-false {
      ${isShowHidden ? 'opacity: 1;' : ''}
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
      const value = <string | undefined>node.layout[responsiveMode][directionToField(direction)]
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
  .${responsiveMode}\\:${flatCapital(directionToField(direction))}-${convertedCurrent} {
    ${flatCapital(directionToField(direction))}: ${current};
  }
}
`
  }, '')
}

const directionToField = (direction: Direction) => direction === 'left'
    ? 'paddingLeft'
    : direction === 'right'
        ? 'paddingRight'
        : direction === 'top'
            ? 'paddingTop'
            : 'paddingBottom'

const flatCapital = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)