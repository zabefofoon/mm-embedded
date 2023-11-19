<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <IconButton icon="mm-icon-html"
                title="Download html"
                @click="downloadHtml"/>
    <IconButton icon="mm-icon-json"
                title="Download json"
                @click="downloadJson"/>
  </div>
</template>

<script setup lang="ts">
import IconButton from "./atom/IconButton.vue"
import {generateCss} from "../util/generateCss"
import {generateHtml} from "../util/generateHtml"
import {usePagesStore} from "../store/page.store"
import {useWidgetStore} from "../store/widget.store"
import {removeSpacing} from "../util/util"
import {deepClone} from "../util/util"

import prettyHtml from 'pretty'
import beautifyJson from 'json-beautify'

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

const downloadHtml = () => {
  const contents = removeSpacing(generateHtml(pageStore.currentPage.nodes))
  const css = generateCss(pageStore.currentPage?.nodes || [], widgetStore.widgetGroups)
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
`, {ocd: true})

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/html;charset=utf-8, ' + encodeURIComponent(html))
  element.setAttribute('download', 'index.html')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}

const downloadJson = () => {
  const json = {
      pages: deepClone(pageStore.pages),
      widgetGroups: deepClone(widgetStore.widgetGroups)
    }

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/json;charset=utf-8, ' + encodeURIComponent(JSON.parse(beautifyJson(JSON.stringify(json), [], 2,100))))
  element.setAttribute('download', 'data.json')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}
</script>

<style scoped>

</style>