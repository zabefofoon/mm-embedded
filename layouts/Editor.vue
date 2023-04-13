<template>
  <UiStyle>{{ generatedCss }}</UiStyle>
  <div class="flex flex-col | relative | w-full h-screen | overflow-hidden">
    <Header/>
    <div class="flex | w-full h-full"
         style="max-height: calc(100vh - 80px);">
      <PagesPanel/>
      <main class="w-full h-full | bg-slate-100">
        <slot/>
      </main>
      <ConfigNodePanel/>
    </div>
    <Footer/>
    <ConfigWidgetLayer/>
  </div>
  <ModalsContainer/>
</template>

<script setup lang="ts">
import {ModalsContainer} from 'vue-final-modal'
import Header from "~/components/editor/Header.vue"
import Footer from "~/components/editor/Footer.vue"
import PagesPanel from "~/components/editor/PagesPanel.vue"
import ConfigNodePanel from "~/components/editor/ConfigNodePanel.vue"
import ConfigWidgetLayer from '~/components/editor/ConfigWidgetLayer.vue'
import UiStyle from "~/components/atom/UiStyle.vue"
import {usePagesStore} from "~/store/page.store"
import {useWidgetStore} from "~/store/widget.store"
import {storeToRefs} from "pinia"
import {computed} from "#imports"
import {generateCss} from "~/util/generateCss"

const pageStore = usePagesStore()

const widgetStore = useWidgetStore()

const {widgetGroups} = storeToRefs(widgetStore)
const generatedCss = computed(() => generateCss(pageStore.currentPage?.nodes || [], widgetGroups.value))
</script>

<style scoped>

</style>