<template>
  <div class="tw-flex tw-justify-center tw-gap-2">
    <IconButton icon="mm-icon-html"
                @click="downloadHtml"/>
    <IconButton icon="mm-icon-css"
                @click="downloadCss"/>
  </div>
</template>

<script setup lang="ts">
import IconButton from "./atom/IconButton.vue"
import {generateCss} from "../util/generateCss"
import {generateHtml} from "../util/generateHtml"
import {usePagesStore} from "../store/page.store"
import {useWidgetStore} from "../store/widget.store"
import {removeSpacing} from "../util/util"

const pageStore = usePagesStore()
const widgetStore = useWidgetStore()

/*  반응형이 동작하지 않는다면 meta 태그 추가
 <meta content="width=device-width, initial-scale=1" name="viewport" />
*/
const downloadHtml = () => {
  const html = removeSpacing(generateHtml(pageStore.currentPage.nodes))

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/html;charset=utf-8, ' + encodeURIComponent(html))
  element.setAttribute('download', 'index.html')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}

const downloadCss = () => {
  const css = generateCss(pageStore.currentPage?.nodes || [], widgetStore.widgetGroups)

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/css;charset=utf-8, ' + encodeURIComponent(css))
  element.setAttribute('download', 'style.css')
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}
</script>

<style scoped>

</style>