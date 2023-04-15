<template>
  <header class="border-b | flex items-center gap-2 | pl-4 py-2">
    <IconButton v-if="$route.query.save"
                icon="icon-save"
                @click="save"/>
    <IconButton icon="icon-screen-size"
                :active="screenStore.screenMode === 'size'"
                @click="screenStore.setScreenMode('size')"/>
    <IconButton icon="icon-eye"
                :active="screenStore.screenMode === 'view'"
                @click="screenStore.setScreenMode('view')"/>
    <IconButton icon="icon-download"
                :active="screenStore.screenMode === 'download'"
                @click="screenStore.setScreenMode('download')"/>
    <IconDivider/>
    <HeaderScreenSize v-if="screenStore.screenMode === 'size'"/>
    <HeaderScreenView v-else-if="screenStore.screenMode === 'view'"/>
    <HeaderScreenDownload v-else-if="screenStore.screenMode === 'download'"/>
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

</script>

<style scoped>

</style>