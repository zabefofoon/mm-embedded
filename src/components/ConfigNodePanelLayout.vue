<template>
  <div v-if="pageStore.currentPage?.selectedIds.length === 1"
       class="flex flex-col">
    <h3 class="bg-slate-400 text-white | px-3 py-1 | text-sm">layout</h3>
    <ResponsiveButton :model-value="pageStore.selectedNodes[0].selectedResponsiveMode"
                      @change="pageStore.selectResponsiveMode($event)"/>
    <ul>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="type" class="w-20 | text-xs">type</label>
        <select id="type"
                class="w-full | text-sm border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type"
                @change="pageStore.setNodesLayoutType($event.target.value)">
          <option>stack</option>
          <option>grid</option>
        </select>
      </li>
      <li v-if="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type === 'stack'"
          class="flex items-center gap-2 | px-3 py-1">
        <label for="direction"
               class="w-20 | text-xs">direction</label>
        <select id="direction"
                class="w-full | text-sm border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].direction"
                @change="pageStore.setNodesLayoutStackDirection($event.target.value)">
          <option value="horizontal"
                  label="horizontal"></option>
          <option value="vertical"
                  label="vertical"></option>
          <option v-show="false"
                  :value="undefined"
                  label="mix"></option>
        </select>
      </li>
      <li v-if="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].type === 'grid'"
          class="flex items-center gap-2 | px-3 py-1">
        <label for="columns"
               class="w-20 | text-xs">columns</label>
        <input id="columns"
               min="1"
               max="12"
               class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
               type="number"
               placeholder="length"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].columns"
               @keydown.stop
               @change="pageStore.setNodesLayoutGridColumns($event.target.value)"/>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="gap"
               class="w-20 | text-xs">gap</label>
        <input id="gap"
               class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
               placeholder="px, %, vw"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].gap"
               @keydown.stop
               @change="pageStore.setNodesLayoutGap($event.target.value)"/>
      </li>
      <hr class="my-2"/>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="width"
               class="w-20 | text-xs">width</label>
        <input id="width"
               class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
               placeholder="px, %, vw"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].width"
               @keydown.stop
               @change="pageStore.setNodesLayoutWidth($event.target.value)"/>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="height"
               class="w-20 | text-xs">height</label>
        <input id="height"
               class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
               placeholder="px, %, vw"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].height"
               @keydown.stop
               @change="pageStore.setNodesLayoutHeight($event.target.value)"/>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="max-width"
               class="w-20 | text-xs">maxWidth</label>
        <input id="max-width"
               class="px-1 | w-full | text-sm border border-white hover:border-orange-500"
               placeholder="px, %, vw"
               :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].maxWidth"
               @keydown.stop
               @change="pageStore.setNodesLayoutMaxWidth($event.target.value)"/>
      </li>
      <hr class="my-2"/>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="mainAxis"
               class="w-20 | text-xs">mainAxis</label>
        <select id="mainAxis"
                class="w-full | text-sm border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].mainAxis"
                @change="pageStore.setNodesLayoutMainAxis($event.target.value)">
          <option>start</option>
          <option>center</option>
          <option>end</option>
          <option>between</option>
          <option v-show="false" :value="undefined" label="start"></option>
        </select>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="crossAxis"
               class="w-20 | text-xs">crossAxis</label>
        <select id="crossAxis"
                class="w-full | text-sm border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].crossAxis"
                @change="pageStore.setNodesLayoutCrossAxis($event.target.value)">
          <option>start</option>
          <option>center</option>
          <option>end</option>
          <option v-show="false" :value="undefined" label="start"></option>
        </select>
      </li>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="crossAxis"
               class="w-20 | text-xs">hidden</label>
        <button class="w-full | px-1 | text-sm border  hover:border-orange-500"
                :class="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].hidden ? 'text-slate-500 border-slate-500' : 'text-slate-200 border-slate-200'"
                @click="pageStore.setNodesLayoutHidden(!pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].hidden)">
          hidden
        </button>
      </li>
      <hr class="my-2"/>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="position"
               class="w-20 | text-xs">position</label>
        <select id="position"
                class="w-full | text-sm border border-white hover:border-orange-500"
                :value="pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].position"
                @change="pageStore.setNodesLayoutPosition($event.target.value)">
          <option>relative</option>
          <option>absolute</option>
          <option>sticky</option>
          <option>fixed</option>
          <option v-show="false" :value="undefined" label="relative"></option>
        </select>
      </li>
      <li class="flex items-start gap-2 | px-3 py-1">
        <label for="inset"
               class="w-20 | text-xs">inset</label>
        <div class="w-full">
          <div class="flex gap-1">
            <div class="flex gap-2 | w-1/2">
              <label for="left"><i class="icon icon-padding-left"></i></label>
              <input id="left"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].left"
                     @change="pageStore.setNodesLayoutInset('left', $event.target.value)"/>
            </div>
            <div class="flex gap-2 | w-1/2">
              <label for="right"><i class="icon icon-padding-right"></i></label>
              <input id="right"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].right"
                     @change="pageStore.setNodesLayoutInset('right', $event.target.value)"/>
            </div>
          </div>
          <div class="flex gap-1">
            <div class="flex gap-2 | w-1/2">
              <label for="top"><i class="icon icon-padding-top"></i></label>
              <input id="top"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].top"
                     @change="pageStore.setNodesLayoutInset('top', $event.target.value)"/>
            </div>
            <div class="flex gap-2 | w-1/2">
              <label for="bottom"><i class="icon icon-padding-bottom"></i></label>
              <input id="bottom"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].bottom"
                     @change="pageStore.setNodesLayoutInset('bottom', $event.target.value)"/>
            </div>
          </div>
        </div>
      </li>
      <hr class="my-2"/>
      <li class="flex items-start gap-2 | px-3 py-1">
        <label for="padding-left"
               class="w-20 | text-xs">padding</label>
        <div class="w-full">
          <div class="flex gap-1">
            <div class="flex gap-2 | w-1/2">
              <label for="padding-left"><i class="icon icon-padding-left"></i></label>
              <input id="padding-left"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingLeft"
                     @change="pageStore.setNodesLayoutPadding('left', $event.target.value)"/>
            </div>
            <div class="flex gap-2 | w-1/2">
              <label for="padding-right"><i class="icon icon-padding-right"></i></label>
              <input id="padding-right"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingRight"
                     @change="pageStore.setNodesLayoutPadding('right', $event.target.value)"/>
            </div>
          </div>
          <div class="flex gap-1">
            <div class="flex gap-2 | w-1/2">
              <label for="padding-top"><i class="icon icon-padding-top"></i></label>
              <input id="padding-top"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingTop"
                     @change="pageStore.setNodesLayoutPadding('top', $event.target.value)"/>
            </div>
            <div class="flex gap-2 | w-1/2">
              <label for="padding-bottom"><i class="icon icon-padding-bottom"></i></label>
              <input id="padding-bottom"
                     class="w-full | text-sm border border-white hover:border-orange-500"
                     placeholder="px"
                     :value="pageStore.getSelectedNodeOne()?.layout[pageStore.selectedNodes[0].selectedResponsiveMode].paddingBottom"
                     @change="pageStore.setNodesLayoutPadding('bottom', $event.target.value)"/>
            </div>
          </div>
        </div>
      </li>
      <hr class="my-2"/>
      <li class="flex items-center gap-2 | px-3 py-1">
        <label for="crossAxis"
               class="w-20 | text-xs">transparent</label>
        <button class="w-full | px-1 | text-sm border  hover:border-orange-500"
                :class="pageStore.getSelectedNodeOne().layout[pageStore.selectedNodes[0].selectedResponsiveMode].transparent ? 'text-slate-500 border-slate-500' : 'text-slate-200 border-slate-200'"
                @click="pageStore.setNodesTransparent(!pageStore.selectedNodes[0].layout[pageStore.selectedNodes[0].selectedResponsiveMode].transparent)">
          transparent
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import ResponsiveButton from "./atom/ResponsiveButton.vue"

const pageStore = usePagesStore()
</script>

<style scoped lang="scss">

</style>