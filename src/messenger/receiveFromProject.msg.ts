import type {Group} from "../model/Widget"
import type {Page} from "../model/Page"

export type ReceivedData = {
  pages: Page[]
  currentPageId: string
  selectedNodeIds: string[]
  data: Group[]
  screenData: {
    isShowSpacing: boolean
    isShowOutline: boolean
    isShowHidden: boolean
    isShowMarker: boolean
  }
  widgetGroups: Group[]
  widgetId?: string
}
export type ReceivedDataType = 'loadData'
    | 'connectedUser'
    | 'importWidgets'
    | 'undefinedMessage'

export const receiveFromProject = (event: MessageEvent): [ReceivedDataType, Partial<ReceivedData>] => {
  const data: ReceivedData = event.data
  if (event.data.type === 'loadData')
    return ['loadData', data]
  if (event.data.type === 'connectedUser')
    return ['connectedUser', data]
  if (event.data.type === 'importWidgetGroups')
    return ['importWidgets', data]

  return ['undefinedMessage', data]
}