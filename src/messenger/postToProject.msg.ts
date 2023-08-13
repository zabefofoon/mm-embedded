import type {Group} from "../model/Widget"
import {deepClone} from "../util/util"
import type {PageData} from "../model/Page"

export const postProjectSaveProject = (pages: PageData[],
                                       widgetGroups: Group[]) => window
    .parent
    ?.postMessage({
      type: 'saveProject',
      pages: deepClone(pages),
      widgetGroups: deepClone(widgetGroups)
    }, '*')

export const postProjectWidgetGroupsMutation = (widgetGroups: Group[]) => window
    .parent
    ?.postMessage({
      type: 'widgetGroupsMutation',
      widgetGroups: deepClone(widgetGroups),
    }, '*')

export const postProjectRealtimeEditProject = (pages: PageData[]) => window
    .parent
    ?.postMessage({
      type: 'pageMutation',
      pages: deepClone(pages),
    }, '*')
