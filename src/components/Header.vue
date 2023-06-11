<template>
  <header class="tw-border-b | tw-flex items-center tw-gap-2 | tw-pl-4 tw-py-2">
    <IconButton v-if="$route.query.save"
                icon="mm-icon-save"
                @click="save"/>
    <IconButton icon="mm-icon-screen-size"
                :active="screenStore.screenMode === 'size'"
                @click="screenStore.setScreenMode('size')"/>
    <IconButton icon="mm-icon-eye"
                :active="screenStore.screenMode === 'view'"
                @click="screenStore.setScreenMode('view')"/>
    <IconButton icon="mm-icon-download"
                :active="screenStore.screenMode === 'download'"
                @click="screenStore.setScreenMode('download')"/>
    <IconDivider/>
    <HeaderScreenSize v-if="screenStore.screenMode === 'size'"/>
    <HeaderScreenView v-else-if="screenStore.screenMode === 'view'"/>
    <HeaderScreenDownload v-else-if="screenStore.screenMode === 'download'"/>
    <div class="tw-flex tw-gap-1 | tw-ml-auto tw-mr-12">
      <button v-for="user in peerStore.connectedUsers"
              :title="user"
              class="user-pill | tw-px-2.5 tw-py-1 | tw-text-sm tw-text-white tw-rounded-full"
              @key="user">
        {{ user.charAt(0).toUpperCase() }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconButton from "./atom/IconButton.vue"
import IconDivider from "./atom/IconDivider.vue"
import HeaderScreenView from "./HeaderScreenView.vue"
import HeaderScreenSize from "./HeaderScreenSize.vue"
import HeaderScreenDownload from "./HeaderScreenDownload.vue"
import {useScreenStore} from "../store/screen.store"
import {usePagesStore} from "../store/page.store"
import {useWidgetStore} from "../store/widget.store"
import {deepClone} from "../util/util"
import {usePeerStore} from "../store/peer.store"

const screenStore = useScreenStore()

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

const save = () => {
  window.parent
      ?.postMessage({
        type: 'saveProject',
        data: {
          pages: deepClone(pageStore.pages),
          widgetGroups: deepClone(widgetStore.widgetGroups),
        }
      }, '*')
  alert('saved')
}

const peerStore = usePeerStore()
</script>

<style lang="scss" scoped>
.user-pill {
  &:nth-child(4n-3) {
    background: #B10F2E;
  }

  &:nth-child(4n-2) {
    background: #1B98E0;
  }

  &:nth-child(4n-1) {
    background: #FAC748;
  }

  &:nth-child(4n) {
    background: #99C5B5;
  }

}
</style>