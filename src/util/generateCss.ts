import type { Group } from '../model/Widget'
import type { Direction, Node, ResponsiveMode } from '../model/Node'
import { usePagesStore } from '../store/page.store'

const getScreenSize = (responsiveMode: ResponsiveMode) =>
  responsiveMode === 'small' ? '0px' : '768px'

export const generateCss = (
  nodes: Node[],
  groups: Group[],
  isShowHidden = false
): string =>
  generatePreflightCss() +
  `\n` +
  generateCoreCss() +
  `\n` +
  generateLayoutCss(nodes, isShowHidden) +
  `\n` +
  generateWidgetCss(nodes, groups)

const generatePreflightCss = () => {
  const pageStore = usePagesStore()

  if (!pageStore.downloadOptions.includePreflight) return ``

  return `
*,
::before,
::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e2e8f0;
}

::before,
::after {
    --tw-content: '';
}

html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
}

body {
    margin: 0;
    line-height: inherit;
}

hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
}

abbr:where([title]) {
    text-decoration: underline dotted;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: inherit;
    font-weight: inherit;
}

a {
    color: inherit;
    text-decoration: inherit;
}

b,
strong {
    font-weight: bolder;
}

code,
kbd,
samp,
pre {
    font-size: 1em;
}

small {
    font-size: 80%;
}

sub,
sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
}

sub {
    bottom: -0.25em;
}

sup {
    top: -0.5em;
}

table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
}

button,
input,
optgroup,
select,
textarea {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
}

button,
select {
    text-transform: none;
}

button,
[type='button'],
[type='reset'],
[type='submit'] {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
}

:-moz-focusring {
    outline: auto;
}

:-moz-ui-invalid {
    box-shadow: none;
}

progress {
    vertical-align: baseline;
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
    height: auto;
}

[type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
}

::-webkit-search-decoration {
    -webkit-appearance: none;
}

::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
}

summary {
    display: list-item;
}

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
    margin: 0;
}

fieldset {
    margin: 0;
    padding: 0;
}

legend {
    padding: 0;
}

ol,
ul,
menu {
    list-style: none;
    margin: 0;
    padding: 0;
}

textarea {
    resize: vertical;
}

input::placeholder,
textarea::placeholder {
    opacity: 1;
}

button,
[role="button"] {
    cursor: pointer;
}

:disabled {
    cursor: default;
}

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
    display: block;
    vertical-align: middle;
}

img,
video {
    max-width: 100%;
    height: auto;
}

[hidden] {
    display: none;
}
  `
}

const generateCoreCss = () => {
  const pageStore = usePagesStore()

  return `
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
}  
  
.node {
  width: 100%;
  border-collapse: collapse;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  ${pageStore.downloadOptions.showBorder ? 'outline: 1px dashed #ccc;' : ''}
}
${
  pageStore.downloadOptions.showEmptyArea
    ? `
  .empty-node {
    border: 1px dashed #ccc;
    text-align: center;
    padding: 4px 0;
  }
  `
    : ``
}


.node > * {
  width: 100%;
}
`
}

export const generateDragAreaCss = (groups: Group[]) => {
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

${groups
  .flatMap(group => group.items)
  .reduce((acc, current) => {
    const newline = acc ? '\n\n' : ''
    return acc + newline + current.css
  }, '')}
`
}

const generateLayoutCss = (nodes: Node[], isShowHidden: boolean) => {
  return (
    generatePosition(nodes, 'small') +
    generatePosition(nodes, 'large') +
    generateCrossAxis(nodes, 'small') +
    generateCrossAxis(nodes, 'large') +
    generateMainAxis(nodes, 'small') +
    generateMainAxis(nodes, 'large') +
    generateTransparent(nodes, 'small') +
    generateTransparent(nodes, 'large') +
    generateHidden(nodes, 'small', isShowHidden) +
    generateHidden(nodes, 'large', isShowHidden) +
    generateFlexDirection(nodes, 'small') +
    generateFlexDirection(nodes, 'large') +
    generateDisplayType(nodes, 'small') +
    generateDisplayType(nodes, 'large') +
    generateGap(nodes, 'small') +
    generateGap(nodes, 'large') +
    generateColumns(nodes, 'small') +
    generateColumns(nodes, 'large') +
    generateWidth(nodes, 'small') +
    generateWidth(nodes, 'large') +
    generateHeight(nodes, 'small') +
    generateHeight(nodes, 'large') +
    generateZIndex(nodes, 'small') +
    generateZIndex(nodes, 'large') +
    generateMaxWidth(nodes, 'small') +
    generateMaxWidth(nodes, 'large') +
    generatePadding(nodes, 'small', 'left') +
    generatePadding(nodes, 'small', 'top') +
    generatePadding(nodes, 'small', 'right') +
    generatePadding(nodes, 'small', 'bottom') +
    generatePadding(nodes, 'large', 'left') +
    generatePadding(nodes, 'large', 'top') +
    generatePadding(nodes, 'large', 'right') +
    generatePadding(nodes, 'large', 'bottom') +
    generateInset(nodes, 'small', 'left') +
    generateInset(nodes, 'small', 'top') +
    generateInset(nodes, 'small', 'right') +
    generateInset(nodes, 'small', 'bottom') +
    generateInset(nodes, 'large', 'left') +
    generateInset(nodes, 'large', 'top') +
    generateInset(nodes, 'large', 'right') +
    generateInset(nodes, 'large', 'bottom')
  )
}

const generatePosition = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].position

      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return current
      ? acc +
          `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:position-${current} {
    position: ${current};
  }
}
`
      : ''
  }, '')
}

const generateCrossAxis = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].crossAxis

      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return current
      ? acc +
          `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:crossAxis-${current} {
    align-items: ${current};
  }
}
`
      : ''
  }, '')
}

const generateMainAxis = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].mainAxis

      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return current
      ? acc +
          `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:mainAxis-${current} {
    justify-content: ${current === 'between' ? 'space-between' : current};
  }
}
`
      : ''
  }, '')
}

const generateTransparent = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: boolean[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <boolean | undefined>node.layout[responsiveMode].transparent

      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return current
      ? acc +
          `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:transparent {
    background: #ffffff;
  }
}
`
      : ''
  }, '')
}

const generateHidden = (
  nodes: Node[],
  responsiveMode: ResponsiveMode,
  isShowHidden: boolean
) => {
  const result: boolean[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <boolean | undefined>node.layout[responsiveMode].hidden

      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return current
      ? acc +
          `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:hidden-${current} {
    ${isShowHidden ? 'opacity: .3;' : 'display: none;'}
  }
}
`
      : ''
  }, '')
}

const generateFlexDirection = (
  nodes: Node[],
  responsiveMode: ResponsiveMode
) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].direction
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce(
    (acc, current) =>
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:direction-${current} {
    flex-direction: ${current === 'horizontal' ? 'row' : 'column'};
  }
}
`,
    ''
  )
}

const generateDisplayType = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].type
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce(
    (acc, current) =>
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:type-${current} {
    display: ${current === 'stack' ? 'flex' : 'grid'};
  }
}
`,
    ''
  )
}

const generateGap = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].gap
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce(
    (acc, current) =>
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:gap-${current} {
    gap: ${current};
  }
}
`,
    ''
  )
}

const generateColumns = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].columns
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce(
    (acc, current) =>
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:columns-${current} {
    grid-template-columns: repeat(${current}, 1fr);
  }
}
`,
    ''
  )
}

const generateWidth = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].width
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')
    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:width-${convertedCurrent} {
    width: ${current};
  }
}
`
    )
  }, '')
}

const generateHeight = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].height
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:height-${convertedCurrent} {
    height: ${current};
  }
}
`
    )
  }, '')
}

const generateZIndex = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].zIndex
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:zIndex-${current} {
  z-index: ${current};
  }
}
`
    )
  }, '')
}

const generateMaxWidth = (nodes: Node[], responsiveMode: ResponsiveMode) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode].maxWidth
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:maxWidth-${convertedCurrent} {
    max-width: ${current};
  }
}
`
    )
  }, '')
}

const generatePadding = (
  nodes: Node[],
  responsiveMode: ResponsiveMode,
  direction: Direction
) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>(
        node.layout[responsiveMode][directionToPaddingField(direction)]
      )
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:${flatCapital(
        directionToPaddingField(direction)
      )}-${convertedCurrent} {
    ${flatCapital(directionToPaddingField(direction))}: ${current};
  }
}
`
    )
  }, '')
}

const generateInset = (
  nodes: Node[],
  responsiveMode: ResponsiveMode,
  direction: Direction
) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.layout[responsiveMode][direction]
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return result.reduce((acc, current) => {
    const convertedCurrent = current.replace('%', '\\%')

    return (
      acc +
      `
@media(min-width: ${getScreenSize(responsiveMode)}) {
  .${responsiveMode}\\:${direction}-${convertedCurrent} {
    ${direction}: ${current};
  }
}
`
    )
  }, '')
}

const directionToPaddingField = (direction: Direction) =>
  direction === 'left'
    ? 'paddingLeft'
    : direction === 'right'
    ? 'paddingRight'
    : direction === 'top'
    ? 'paddingTop'
    : 'paddingBottom'

const flatCapital = (str: string) =>
  str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

const generateWidgetCss = (nodes: Node[], groups: Group[]) => {
  const result: string[] = []

  const recursive = (nodes: Node[]) => {
    nodes?.forEach(node => {
      const value = <string | undefined>node.widget?.id
      if (value && !result.includes(value)) result.push(value)
      recursive(node.nodes)
    })
  }

  recursive(nodes)

  return groups
    .flatMap(group => group.items)
    .filter(item => item.id && result.includes(item.id))
    .reduce((acc, current) => {
      const newline = acc ? '\n\n' : ''
      return acc + newline + current.css
    }, '')
}
