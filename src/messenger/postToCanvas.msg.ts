import type { Page } from '../model/Page'
import type { Group } from '../model/Widget'
import { deepClone } from '../util/util'

export const postCanvasWidgetGroupsMutation = (
  canvas: HTMLIFrameElement | undefined,
  widgetGroups: Group[]
) =>
  canvas?.contentWindow?.postMessage({
    type: 'widgetGroupsMutation',
    widgetGroups: deepClone(widgetGroups),
  })

export const postCanvasPageMutation = (
  canvas: HTMLIFrameElement | undefined,
  pages: Page[],
  selectedNodeIds: string[],
  currentPageId?: string
) =>
  canvas?.contentWindow?.postMessage({
    type: 'pagesMutation',
    pages: deepClone(pages),
    selectedNodeIds: deepClone(selectedNodeIds),
    currentPageId: currentPageId,
  })

export const postCanvasScreenMutation = (
  canvas: HTMLIFrameElement | undefined,
  isShowSpacing: boolean,
  isShowOutline: boolean,
  isShowHidden: boolean,
  isShowMarker: boolean
) =>
  canvas?.contentWindow?.postMessage({
    type: 'screenMutation',
    screenData: deepClone({
      isShowSpacing,
      isShowOutline,
      isShowHidden,
      isShowMarker,
    }),
  })

export const postCanvasSelectUsingWidget = (
  canvas: HTMLIFrameElement | undefined,
  selectedUsingWidgetId?: string
) =>
  canvas?.contentWindow?.postMessage({
    type: 'selectUsingWidget',
    selectedUsingWidgetId,
  })
