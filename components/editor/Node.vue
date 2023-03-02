<template>
  <div class="node | w-full min-h-8 | relative | p-2 | border border-dashed border-2"
       :class="[selectedClass, layoutClass]"
       @click.stop="pageStore.selectNodeOne(node.id)">
    <div v-if="node.widget"
         v-html="node.widget.html"></div>
    <template v-else>
      <p v-if="node.nodes.length === 0"
         class="text-center text-slate-500">space</p>
      <Node v-for="child in node.nodes"
            :key="child.id"
            :node="child"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {Node as NodeType, ResponsiveMode, usePagesStore} from "~/store/page.store"
import {computed} from "#imports"

const props = defineProps({
  node: {
    type: NodeType,
    required: true
  }
})

const pageStore = usePagesStore()

const selectedClass = computed(() => pageStore.pageData.selectedIds.includes(props.node.id)
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
      if (props.node.layout[current].mainAxis)
        result = result + `${current}:mainAxis-${props.node.layout[current].mainAxis} `
      if (props.node.layout[current].crossAxis)
        result = result + `${current}:crossAxis-${props.node.layout[current].crossAxis} `
      return acc + result
    }, ''))

</script>

<style scoped lang="scss">

</style>