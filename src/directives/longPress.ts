import type { Directive, ObjectDirective } from 'vue'
import { onUnmounted } from 'vue'

let longPressed = false

const longPressDirective: ObjectDirective = {
  mounted(el, binding) {
    let pressTimer: NodeJS.Timeout | undefined

    const start = (event: MouseEvent) => {
      if (event.type === 'click' && event.button !== 0) {
        return
      }
      longPressed = false
      if (pressTimer === undefined) {
        pressTimer = setTimeout(() => {
          binding.value(event)
          longPressed = true
        }, Number(binding.arg) || 1000)
      }
    }

    const cancel = () => {
      if (pressTimer !== undefined) {
        clearTimeout(pressTimer)
        pressTimer = undefined
      }
    }

    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    el.addEventListener('mouseup', (event: MouseEvent) => {
      cancel()
      binding.value(longPressed, event)
    })
    el.addEventListener('touchend', (event: MouseEvent) => {
      cancel()
      binding.value(longPressed, event)
    })
    el.addEventListener('mouseleave', cancel)

    onUnmounted(() => {
      el.removeEventListener('mousedown', start)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('touchend', cancel)
      el.removeEventListener('click', cancel)
      el.removeEventListener('mouseleave', cancel)
    })
  }
}

export const LongPressDirective: Directive = {
  mounted: longPressDirective.mounted
}
