import type {DragNode} from "../model/Action"
import type {Page} from "../model/Page"

export type ReceivedDataFromCanvas = {
  pageData: Page
  selectedNodeIds: string[]
  dragAction: DragNode
  command: 'removeNode'
      | 'addChildNode'
      | 'addSiblingNodeDown'
      | 'copyNode'
      | 'cutNode'
      | 'pasteNode'
      | 'redo'
      | 'undo'
      | 'selectParentNode'
}
export type ReceivedDataType = 'dragNode'
    | 'command'
    | 'pageMutation'
    | 'undefinedMessage'

export const receiveFromCanvas = (event: MessageEvent): [ReceivedDataType, Partial<ReceivedDataFromCanvas>] => {
  const data: ReceivedDataFromCanvas = event.data
  if (event.data.type === 'dragNode')
    return ['dragNode', data]
  if (event.data.type === 'command')
    return ['command', data]
  if (event.data.type === 'pageMutation')
    return ['pageMutation', data]

  return ['undefinedMessage', data]
}