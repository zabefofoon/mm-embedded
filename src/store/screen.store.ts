import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ResponsiveMode } from '../model/Node'

export type ScreenSize = {
  width: string
  height: string
}

export type ScreenMode = 'analyzeWidget' | undefined

export const useScreenStore = defineStore('screen', () => {
  const screenMode = ref<ScreenMode>()
  const setScreenMode = (mode?: ScreenMode) => {
    screenMode.value = mode
  }

  const isShowSpacing = ref(true)
  const toggleShowSpacing = (value?: boolean) => {
    isShowSpacing.value = value !== undefined ? value : !isShowSpacing.value
  }

  const isShowOutline = ref(true)
  const toggleShowOutline = (value?: boolean) => {
    isShowOutline.value = value !== undefined ? value : !isShowOutline.value
  }

  const isShowHidden = ref(true)
  const toggleShowHidden = (value?: boolean) => {
    isShowHidden.value = value !== undefined ? value : !isShowHidden.value
  }

  const isShowMarker = ref(true)
  const toggleMarker = (value?: boolean) => {
    isShowMarker.value = value !== undefined ? value : !isShowMarker.value
  }
  const screenSize = ref<ScreenSize>({
    width: '100%',
    height: '100%',
  })

  const setScreenSize = (axis: keyof ScreenSize, value: string) => {
    screenSize.value[axis] = value
  }

  const responsiveMode = computed<ResponsiveMode>(() => {
    return screenSize.value.width === '100%' ? 'large' : 'small'
  })

  return {
    isShowSpacing,
    toggleShowSpacing,

    isShowOutline,
    toggleShowOutline,

    isShowHidden,
    toggleShowHidden,

    isShowMarker,
    toggleMarker,

    screenMode,
    setScreenMode,

    screenSize,
    setScreenSize,

    responsiveMode
  }
})
