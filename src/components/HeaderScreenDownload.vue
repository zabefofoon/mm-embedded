<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <div class="tw-relative" v-click-away="closeOptions">
      <IconButton
        :class="{ 'tw-bg-slate-300': isShowOptions }"
        icon="mm-icon-html"
        title="Download html"
        v-long-press:300="openOptions"
        @click="downloadHtml" />
      <div
        class="tw-w-1 tw-h-1 tw-bg-slate-500 | tw-absolute tw-right-0 tw-bottom-0"></div>
      <ul
        v-if="isShowOptions"
        class="tw-bg-white | tw-absolute -tw-bottom-1 tw-left-0 tw-translate-y-full | tw-border tw-shadow-md">
        <li
          class="tw-flex tw-gap-1 tw-items-center | tw-px-2 tw-py-1 | tw-text-xs tw-whitespace-nowrap tw-cursor-pointer | tw-border-b | hover:tw-bg-slate-200"
          :class="{
            'tw-text-slate-300': !pageStore.downloadOptions.includePreflight,
          }"
          @click="pageStore.toggleDownloadOptions('includePreflight')">
          <i class="mm-icon mm-icon-check"></i>
          <span>Include Preflight</span>
        </li>
        <li
          class="tw-flex tw-gap-1 tw-items-center | tw-px-2 tw-py-1 | tw-text-xs tw-whitespace-nowrap tw-cursor-pointer | tw-border-b | hover:tw-bg-slate-200"
          :class="{
            'tw-text-slate-300': !pageStore.downloadOptions.showBorder,
          }"
          @click="pageStore.toggleDownloadOptions('showBorder')">
          <i class="mm-icon mm-icon-check"></i>
          <span>Show Outline</span>
        </li>
        <li
          class="tw-flex tw-gap-1 tw-items-center | tw-px-2 tw-py-1 | tw-text-xs tw-whitespace-nowrap tw-cursor-pointer | tw-border-b | hover:tw-bg-slate-200"
          :class="{
            'tw-text-slate-300': !pageStore.downloadOptions.showEmptyArea,
          }"
          @click="pageStore.toggleDownloadOptions('showEmptyArea')">
          <i class="mm-icon mm-icon-check"></i>
          <span>Show Empty Area</span>
        </li>
      </ul>
    </div>

    <IconButton
      icon="mm-icon-json"
      title="Download json"
      @click="downloadJson" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { directive as vClickAway } from 'vue3-click-away'
import { LongPressDirective as vLongPress } from '../directives/longPress'
import { usePagesStore } from '../store/page.store'
import { useWidgetStore } from '../store/widget.store'
import { generateCss } from '../util/generateCss'
import { generateHtml } from '../util/generateHtml'
import { deepClone, removeSpacing } from '../util/util'
import IconButton from './atom/IconButton.vue'

import beautifyJson from 'json-beautify'
import prettyHtml from 'pretty'

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

const downloadHtml = () => {
  const contents = removeSpacing(generateHtml(pageStore.currentPage.nodes))
  const css = generateCss(
    pageStore.currentPage?.nodes || [],
    widgetStore.widgetGroups
  )
  const html = prettyHtml(
    `
<html>
  <head>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <style>${css}</style>
  </head>
  <body>
    ${contents}
  </body>
</html>
`,
    { ocd: true }
  )

  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/html;charset=utf-8, ' + encodeURIComponent(html)
  )
  element.setAttribute('download', 'index.html')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}

const downloadJson = () => {
  const json = {
    pages: deepClone(pageStore.pages),
    widgetGroups: deepClone(widgetStore.widgetGroups),
  }

  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/json;charset=utf-8, ' +
      encodeURIComponent(
        JSON.parse(beautifyJson(JSON.stringify(json), [], 2, 100))
      )
  )
  element.setAttribute('download', 'data.json')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}

const isShowOptions = ref(false)
const showOptions = (value: boolean) => (isShowOptions.value = value)

const openOptions = () => showOptions(true)

const closeOptions = () => showOptions(false)
</script>

<style scoped></style>
