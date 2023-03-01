import {Node, ResponsiveMode} from "~/store/page.store"

const getScreenSize = (responsiveMode: ResponsiveMode) => responsiveMode === 'small' ? '0px' : '768px'

const generateCoreCss = () => {
  return `
.node {
  width: 100%;
  border-collapse: collapse;
}

@media (min-width: 0) {
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
}
`
}

const generateGap = (nodes: Node[],
                     responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes.forEach((node) => {
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
    nodes.forEach((node) => {
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
    nodes.forEach((node) => {
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
    nodes.forEach((node) => {
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


const generateLayoutCss = (nodes: Node[]) => {
  return generateGap(nodes, 'small')
      + generateGap(nodes, 'large')
      + generateColumns(nodes, 'small')
      + generateColumns(nodes, 'large')
      + generateWidth(nodes, 'small')
      + generateWidth(nodes, 'large')
      + generateHeight(nodes, 'small')
      + generateHeight(nodes, 'large')
}

export const generateCss = (nodes: Node[]): string => generateCoreCss() + `\n` + generateLayoutCss(nodes)
