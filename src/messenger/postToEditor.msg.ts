import type { DragNode } from '../model/Action'
import type { Page } from '../model/Page'
import { deepClone } from '../util/util'
import type { ReceivedDataFromCanvas } from './receiveFromCanvas.msg'

export const postEditorDragNode = (dragAction: Partial<DragNode>) =>
  window.parent?.postMessage(
    {
      type: 'dragNode',
      dragAction: deepClone(dragAction)
    },
    '*'
  )

export const postEditorCommand = (command: ReceivedDataFromCanvas['command']) =>
  window.parent?.postMessage(
    {
      type: 'command',
      command
    },
    '*'
  )

export const postEditorPageMutation = (
  pageData: Page,
  selectedNodeIds: string[]
) =>
  window.parent?.postMessage({
    type: 'pageMutation',
    pageData: deepClone(pageData),
    selectedNodeIds: deepClone(selectedNodeIds)
  })

export const postEditorAddWidget = (nodeId: string) => {
  window.parent?.postMessage({
    type: 'addWidget',
    nodeId
  })
}
