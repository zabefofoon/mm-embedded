<template>
  <div class="node | w-full min-h-8 | relative | border border-dashed"
       :class="[selectedClass, layoutClass, spacingClass, outlineClass]"
       @click.stop="$event.ctrlKey || $event.metaKey ? pageStore.selectNodeMany(node.id, $event) :  pageStore.selectNodeOne(node.id)">
    <div v-if="screenStore.isShowMarker && node.marker"
         class="marker | absolute top-0 right-0 | w-3 h-3 | bg-orange-500">
      <article
          class="w-80 h-60 | absolute top-1 right-1 | bg-white border shadow-md">
        <textarea v-model="node.marker.text"
                  class="w-full h-full | p-2 | resize-none text-slate-500 text-sm"
                  placeholder="text"
                  @keydown.stop></textarea>
      </article>
    </div>
    <div v-if="node.widget"
         v-html="node.widget.html"
         class="w-full"></div>
    <template v-else>
      <p v-if="node.nodes.length === 0"
         class="w-full text-center text-slate-500">space</p>
      <Node v-for="child in node.nodes"
            :key="child.id"
            :node="child"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {usePagesStore} from "~/store/page.store"
import {computed} from "#imports"
import {useScreenStore} from "~/store/screen.store"
import {Node as NodeType, ResponsiveMode} from "~/model/Node"

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

const selectedClass = computed(() => pageStore.currentPage?.selectedIds.includes(props.node.id)
    ? 'border-orange-500'
    : 'border-slate-500')

const layoutClass = computed(() => (<ResponsiveMode[]>Object.keys(props.node.layout))
    .reduce<string>((acc, current) => {
      let result = ''
      if (props.node.layout[current].type)
        result = result + `${current}:type-${props.node.layout[current].type} `
      if (props.node.layout[current].direction)
        result = result + `${current}:direction-${props.node.layout[current].direction} `
      if (props.node.layout[current].columns)
        result = result + `${current}:columns-${props.node.layout[current].columns} `
      if (props.node.layout[current].gap)
        result = result + `${current}:gap-${props.node.layout[current].gap} `
      if (props.node.layout[current].width)
        result = result + `${current}:width-${props.node.layout[current].width} `
      if (props.node.layout[current].height)
        result = result + `${current}:height-${props.node.layout[current].height} `
      if (props.node.layout[current].maxWidth)
        result = result + `${current}:maxWidth-${props.node.layout[current].maxWidth} `

      if (props.node.layout[current].mainAxis !== undefined)
        result = result + `${current}:mainAxis-${props.node.layout[current].mainAxis} `
      else
        result = result + `${current}:mainAxis-start `

      if (props.node.layout[current].crossAxis !== undefined)
        result = result + `${current}:crossAxis-${props.node.layout[current].crossAxis} `
      else
        result = result + `${current}:crossAxis-start `

      if (props.node.layout[current].hidden !== undefined)
        result = result + `${current}:hidden-${props.node.layout[current].hidden || false} `
      return acc + result
    }, ''))

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
</style>