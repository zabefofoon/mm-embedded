import type {Node as NodeType, ResponsiveMode} from "../model/Node"

export const generateHtml = (nodes: NodeType[]): string => nodes
    .reduce((acc, current) => {
      const classes = generateNodeCss(current)
      const html = current.widget?.html
          ? `<div class="node ${classes}">${current.widget.html.replace(/\r|\n|\t/, '')}</div>`
          : `<div class="node ${classes}">${generateHtml(current.nodes)}</div>`
      return acc + html
    }, '')

const generateNodeCss = (node: NodeType) => (<ResponsiveMode[]>Object
    .keys(node.layout))
    .reduce<string>((acc, current) => {
      let result = ''
      if (node.layout[current].type === 'grid')
        result = result + `${current}:type-${node.layout[current].type} `
      if (node.layout[current].direction === 'horizontal')
        result = result + `${current}:direction-${node.layout[current].direction} `
      if (node.layout[current].columns)
        result = result + `${current}:columns-${node.layout[current].columns} `
      if (node.layout[current].gap)
        result = result + `${current}:gap-${node.layout[current].gap} `
      if (node.layout[current].width)
        result = result + `${current}:width-${node.layout[current].width} `
      if (node.layout[current].height)
        result = result + `${current}:height-${node.layout[current].height} `
      if (node.layout[current].maxWidth)
        result = result + `${current}:maxWidth-${node.layout[current].maxWidth} `

      if (node.layout[current].mainAxis !== undefined)
        result = result + `${current}:mainAxis-${node.layout[current].mainAxis} `

      if (node.layout[current].crossAxis !== undefined)
        result = result + `${current}:crossAxis-${node.layout[current].crossAxis} `

      if (node.layout[current].position !== undefined)
        result = result + `${current}:position-${node.layout[current].position} `

      if (node.layout[current].hidden)
        result = result + `${current}:hidden-${node.layout[current].hidden} `

      if (node.layout[current].paddingLeft !== undefined)
        result = result + `${current}:padding-left-${node.layout[current].paddingLeft} `
      if (node.layout[current].paddingTop !== undefined)
        result = result + `${current}:padding-top-${node.layout[current].paddingTop} `
      if (node.layout[current].paddingRight !== undefined)
        result = result + `${current}:padding-right-${node.layout[current].paddingRight} `
      if (node.layout[current].paddingBottom !== undefined)
        result = result + `${current}:padding-bottom-${node.layout[current].paddingBottom} `

      if (node.layout[current].left !== undefined)
        result = result + `${current}:left-${node.layout[current].left} `
      if (node.layout[current].top !== undefined)
        result = result + `${current}:top-${node.layout[current].top} `
      if (node.layout[current].right !== undefined)
        result = result + `${current}:right-${node.layout[current].right} `
      if (node.layout[current].bottom !== undefined)
        result = result + `${current}:bottom-${node.layout[current].bottom} `

      return acc + result
    }, '')