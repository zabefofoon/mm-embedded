import type {Group} from "../model/Widget"

export type ReceivedData = {
  groups: Group[]
}
export type ReceivedDataType = 'saveGroups'
    | 'groupsMutation'
    | 'undefinedMessage'

export const receiveFromWidgetLayer = (event: MessageEvent): [ReceivedDataType, Partial<ReceivedData>] => {
  const data: ReceivedData = event.data
  if (event.data.type === 'saveGroups')
    return ['saveGroups', data]
  if (event.data.type === 'groupsMutation')
    return ['groupsMutation', data]

  return ['undefinedMessage', data]
}