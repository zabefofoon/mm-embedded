<template>
  <div :id="node.id"
       class="draggable node | w-full min-h-8 | border border-dashed"
       :class="[selectedClass, layoutClass, spacingClass, outlineClass, flexClass]"
       @click.stop="$event.ctrlKey || $event.metaKey ? pageStore.selectNodeMany(node.id) :  pageStore.selectNodeOne(node.id)">
    <div v-if="screenStore.isShowMarker && node.marker"
         class="marker | absolute top-0 right-0 | w-3 h-3 | bg-orange-500">
      <article class="w-80 h-60 | absolute z-10 | bg-white border shadow-md">
        <textarea v-model="node.marker.text"
                  class="w-full h-full | p-2 | resize-none text-slate-500 text-sm"
                  placeholder="text"
                  @keydown.stop></textarea>
      </article>
    </div>
    <div v-if="node.widget"
         v-html="node.widget.html"
         class="w-full h-full"></div>
    <template v-else>
      <p class="w-full text-center text-slate-500">space</p>
      <draggable v-bind="dragOptions"
                 :list="node.nodes"
                 :id="`drag_${node.id}`"
                 class="drag-area w-full h-full"
                 :class="[flexClass, gridClass]"
                 @start="startHandler"
                 @end="endHandler">
        <Node v-for="child in node.nodes"
              :key="child.id"
              :node="child"/>
      </draggable>
    </template>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "../store/page.store"
import {computed, watch} from "vue"
import {useScreenStore} from "../store/screen.store"
import type {ResponsiveMode} from "../model/Node"
import {Node as NodeType} from "../model/Node"
import {VueDraggableNext as Draggable} from "vue-draggable-next"

const props = defineProps({
  node: {
    type: NodeType,
    required: true
  }
})

const screenStore = useScreenStore()

const pageStore = usePagesStore()

const spacingClass = computed(() => screenStore.isShowSpacing ? 'p-2' : '')

const outlineClass = computed(() => screenStore.isShowOutline ? 'border-2' : 'border-0')

const selectedClass = computed(() => pageStore.selectedNodeIds.includes(props.node.id)
    ? 'border-orange-500'
    : 'border-slate-500')

const gridClass = computed(() => (<ResponsiveMode[]>Object.keys(props.node.layout))
    .reduce<string>((acc, current) => {
      let result = ''
      if (props.node.layout[current].type === 'grid')
        result = result + `${current}:type-${props.node.layout[current].type} `
      if (props.node.layout[current].columns)
        result = result + `${current}:columns-${props.node.layout[current].columns} `
      return acc + result
    }, ''))

const flexClass = computed(() => (<ResponsiveMode[]>Object.keys(props.node.layout))
    .reduce<string>((acc, current) => {
      let result = ''
      if (props.node.layout[current].type === 'stack')
        result = result + `${current}:type-${props.node.layout[current].type} `
      if (props.node.layout[current].direction)
        result = result + `${current}:direction-${props.node.layout[current].direction} `
      if (props.node.layout[current].gap)
        result = result + `${current}:gap-${props.node.layout[current].gap} `

      if (props.node.layout[current].mainAxis !== undefined)
        result = result + `${current}:mainAxis-${props.node.layout[current].mainAxis} `
      else
        result = result + `${current}:mainAxis-start `

      if (props.node.layout[current].crossAxis !== undefined)
        result = result + `${current}:crossAxis-${props.node.layout[current].crossAxis} `
      else
        result = result + `${current}:crossAxis-start `

      return acc + result
    }, ''))

const layoutClass = computed(() => (<ResponsiveMode[]>Object.keys(props.node.layout))
    .reduce<string>((acc, current) => {
      let result = ''
      if (props.node.layout[current].width)
        result = result + `${current}:width-${props.node.layout[current].width} `
      if (props.node.layout[current].height)
        result = result + `${current}:height-${props.node.layout[current].height} `
      if (props.node.layout[current].maxWidth)
        result = result + `${current}:maxWidth-${props.node.layout[current].maxWidth} `

      if (props.node.layout[current].position !== undefined)
        result = result + `${current}:position-${props.node.layout[current].position} `
      else
        result = result + `${current}:position-relative `


      if (props.node.layout[current].hidden !== undefined)
        result = result + `${current}:hidden-${props.node.layout[current].hidden || false} `

      if (props.node.layout[current].paddingLeft !== undefined)
        result = result + `${current}:padding-left-${props.node.layout[current].paddingLeft} `
      if (props.node.layout[current].paddingTop !== undefined)
        result = result + `${current}:padding-top-${props.node.layout[current].paddingTop} `
      if (props.node.layout[current].paddingRight !== undefined)
        result = result + `${current}:padding-right-${props.node.layout[current].paddingRight} `
      if (props.node.layout[current].paddingBottom !== undefined)
        result = result + `${current}:padding-bottom-${props.node.layout[current].paddingBottom} `

      if (props.node.layout[current].left !== undefined)
        result = result + `${current}:left-${props.node.layout[current].left} `
      if (props.node.layout[current].top !== undefined)
        result = result + `${current}:top-${props.node.layout[current].top} `
      if (props.node.layout[current].right !== undefined)
        result = result + `${current}:right-${props.node.layout[current].right} `
      if (props.node.layout[current].bottom !== undefined)
        result = result + `${current}:bottom-${props.node.layout[current].bottom} `

      if (props.node.layout[current].transparent)
        result = result + `${current}:transparent `

      return acc + result
    }, ''))

const adjustMarkerBody = () => setTimeout(() => {
  [...Array.from(document.body.getElementsByClassName('marker'))]
      .forEach((element) => {
        element.getBoundingClientRect().left > document.body.clientWidth / 2
            ? element.getElementsByTagName('article')[0].classList.add('right-1')
            : element.getElementsByTagName('article')[0].classList.add('left-1')

        element.getBoundingClientRect().top > document.body.clientHeight / 2
            ? element.getElementsByTagName('article')[0].classList.add('bottom-1')
            : element.getElementsByTagName('article')[0].classList.add('top-1')
      })
})

watch(() => pageStore.currentPage.nodes,
    () => adjustMarkerBody(),
    {immediate: true, deep: true})

const dragOptions = {
  animation: 200,
  group: {name: 'g1'},
  disabled: false,
  ghostClass: "ghost",
  draggable: '.draggable'
}

const startHandler = ($event: any) => pageStore.dragNode('start', $event.item.id, $event.oldIndex)

const endHandler = ($event: any) => pageStore.dragNode('end', $event.to.id, $event.newIndex)
</script>

<style scoped lang="scss">
.marker {
  &:hover article {
    display: block;
  }

  article {
    display: none;
  }
}

.node:has(.node) {
  > p {
    display: none;
  }
}
</style>