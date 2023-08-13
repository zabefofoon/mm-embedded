import {deepClone} from "../util/util"
import type {DragNode} from "../model/Action"
import type {ReceivedDataFromCanvas} from "./receiveFromCanvas.msg"
import type {PageData} from "../model/Page"

export const postEditorDragNode = (dragAction: Partial<DragNode>) => window
    .parent
    ?.postMessage({
      type: 'dragNode',
      dragAction: deepClone(dragAction)
    }, '*')

export const postEditorCommand = (command: ReceivedDataFromCanvas['command']) => window
    .parent
    ?.postMessage({
      type: 'command',
      command
    }, '*')

export const postEditorPageMutation = (pageData: PageData,
                                       selectedNodeIds: string[]) => window
    .parent
    ?.postMessage({
      type: 'pageMutation',
      pageData: deepClone(pageData),
      selectedNodeIds: deepClone(selectedNodeIds)
    })