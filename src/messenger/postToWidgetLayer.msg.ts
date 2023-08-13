import {deepClone} from "../util/util"
import type {Group} from "../model/Widget"

export const postInjectGroups = (widgetEditor: HTMLIFrameElement | undefined,
                                 widgetGroups: Group[]) => widgetEditor
    ?.contentWindow
    ?.postMessage({
      type: 'injectGroups',
      groups: deepClone(widgetGroups)
    }, '*')