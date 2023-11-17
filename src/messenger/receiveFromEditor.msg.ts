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
  selectedUsingWidgetId?: string
}
export type ReceivedDataType = 'pagesMutation'
    | 'widgetGroupsMutation'
    | 'screenMutation'
    | 'selectUsingWidget'
    | 'undefinedMessage'

export const receiveFromEditor = (event: MessageEvent): [ReceivedDataType, Partial<ReceivedData>] => {
  const data: ReceivedData = event.data
  if (event.data.type === 'pagesMutation')
    return ['pagesMutation', data]
  if (event.data.type === 'widgetGroupsMutation')
    return ['widgetGroupsMutation', data]
  if (event.data.type === 'screenMutation')
    return ['screenMutation', data]
  if (event.data.type === 'selectUsingWidget')
    return ['selectUsingWidget', data]

  return ['undefinedMessage', data]
}