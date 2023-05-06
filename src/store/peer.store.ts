import {defineStore} from "pinia"
import {ref, watch} from "vue"
import {usePagesStore} from "./page.store"
import {deepClone} from "../util/util"


export const usePeerStore = defineStore('peer', () => {

  const pageStore = usePagesStore()

  const connectedUsers = ref<string[]>([])
  const setConnectedUsers = (users: string[]) => {
    connectedUsers.value = users
  }

  watch(() => [pageStore.actionManager.actions.length, pageStore.actionManager.undoneActions.length],
      () => {
        if (pageStore.circuitBreaker.status === 'off')
          window.parent
              ?.postMessage({
                type: 'realtimeEditProject',
                data: {
                  pages: deepClone(pageStore.pages),
                }
              }, '*')
      }, {deep: true})

  return {
    connectedUsers,
    setConnectedUsers
  }
})