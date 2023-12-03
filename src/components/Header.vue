<template>
  <header class="tw-border-b | tw-flex items-center tw-gap-2 | tw-pl-4 tw-py-2">
    <IconButton
      v-if="$route.query.hideEdit !== 'true'"
      icon="mm-icon-save"
      title="Save project"
      @click="save" />
    <IconButton
      v-if="$route.query.hideLoad !== 'true'"
      icon="mm-icon-upload"
      title="File upload"
      @click="loadFile" />
    <IconDivider />
    <HeaderScreenSize />
    <IconDivider />
    <HeaderScreenView />
    <IconDivider />
    <HeaderScreenDownload />
    <IconDivider />
    <IconButton
      v-if="$route.query.hideAnalyzeWidget !== 'true'"
      icon="mm-icon-analyze"
      :active="screenStore.screenMode === 'analyzeWidget'"
      title="Toggle using widgets"
      @click="toggleAnalyzeWidget" />
    <div class="tw-flex tw-gap-1 | tw-ml-auto tw-mr-12">
      <button
        v-for="user in peerStore.connectedUsers"
        :title="user"
        class="user-pill | tw-px-2.5 tw-py-1 | tw-text-sm tw-text-white tw-rounded-full"
        @key="user">
        {{ user.charAt(0).toUpperCase() }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { postProjectSaveProject } from '../messenger/postToProject.msg'
import type { ReceivedData } from '../messenger/receiveFromProject.msg'
import { usePagesStore } from '../store/page.store'
import { usePeerStore } from '../store/peer.store'
import { useScreenStore } from '../store/screen.store'
import { useWidgetStore } from '../store/widget.store'
import HeaderScreenDownload from './HeaderScreenDownload.vue'
import HeaderScreenSize from './HeaderScreenSize.vue'
import HeaderScreenView from './HeaderScreenView.vue'
import IconButton from './atom/IconButton.vue'
import IconDivider from './atom/IconDivider.vue'

const screenStore = useScreenStore()

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

const save = () => {
  postProjectSaveProject(pageStore.pages, widgetStore.widgetGroups)
  alert('saved')
}

const peerStore = usePeerStore()

const toggleAnalyzeWidget = () => {
  screenStore.screenMode === 'analyzeWidget'
    ? screenStore.setScreenMode()
    : screenStore.setScreenMode('analyzeWidget')
}

const loadFile = () => {
  const element = document.createElement('input')
  element.setAttribute('type', 'file')
  element.click()
  document.body.appendChild(element)
  element.onchange = (event: Event) => {
    const fileReader = new FileReader()
    const file = (<HTMLInputElement>event.target).files?.[0]

    if (!file) return
    fileReader.readAsText(file, 'utf-8')
    fileReader.onload = () => {
      const result = <ReceivedData>JSON.parse(<string>fileReader.result)
      pageStore.loadPages(result.pages)
      widgetStore.setWidgetGroups(result.widgetGroups || [])
      pageStore.selectPage(pageStore.pages?.[0]?.id)
      setTimeout(() => {
        widgetStore.postWidgetStoreToCanvas()
        widgetStore.postWidgetGroupsToEditor()
      }, 100)
    }
  }
  document.body.removeChild(element)
}
</script>

<style lang="scss" scoped>
.user-pill {
  &:nth-child(4n-3) {
    background: #b10f2e;
  }

  &:nth-child(4n-2) {
    background: #1b98e0;
  }

  &:nth-child(4n-1) {
    background: #fac748;
  }

  &:nth-child(4n) {
    background: #99c5b5;
  }
}
</style>
