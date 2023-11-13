<template>
  <header class="tw-border-b | tw-flex items-center tw-gap-2 | tw-pl-4 tw-py-2">
    <IconButton v-if="$route.query.edit" icon="mm-icon-save" @click="save" />
    <IconDivider />   
    <HeaderScreenSize />
    <IconDivider />
    <HeaderScreenView />
    <IconDivider />
    <HeaderScreenDownload />
    <IconDivider />
    <IconButton
      icon="mm-icon-analyze"
      :active="screenStore.screenMode === 'analyzeWidget'"
      @click="screenStore.setScreenMode('analyzeWidget')" />
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
import IconButton from './atom/IconButton.vue'
import IconDivider from './atom/IconDivider.vue'
import HeaderScreenView from './HeaderScreenView.vue'
import HeaderScreenSize from './HeaderScreenSize.vue'
import HeaderScreenDownload from './HeaderScreenDownload.vue'
import { useScreenStore } from '../store/screen.store'
import { usePagesStore } from '../store/page.store'
import { useWidgetStore } from '../store/widget.store'
import { usePeerStore } from '../store/peer.store'
import { postProjectSaveProject } from '../messenger/postToProject.msg'

const screenStore = useScreenStore()

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

const save = () => {
  postProjectSaveProject(pageStore.pages, widgetStore.widgetGroups)
  alert('saved')
}

const peerStore = usePeerStore()
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
