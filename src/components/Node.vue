<template>
  <div
    :id="node.id"
    class="draggable node | tw-min-h-8 | tw-border tw-border-dashed"
    :class="[selectedClass, layoutClass, spacingClass, outlineClass, flexClass]"
    @click.stop="
      $event.ctrlKey || $event.metaKey
        ? pageStore.selectNodeMany(node.id)
        : pageStore.selectNodeOne(node.id)
    "
    @dblclick.stop="emit('addWidget', node.id)">
    <div
      v-if="screenStore.isShowMarker && node.marker"
      class="marker | tw-absolute tw-top-0 tw-right-0 | tw-bg-orange-500"
      style="width: 1rem !important; height: 1rem !important"
      @mouseenter="calculateMarkerPosition">
      <article
        class="tw-w-80 tw-h-60 | tw-absolute tw-z-10 tw-top-2 tw-left-2 | tw-bg-white tw-border tw-shadow-md">
        <textarea
          v-model="node.marker.text"
          class="tw-w-full tw-h-full | tw-p-2 | tw-resize-none tw-text-slate-500 tw-text-sm"
          placeholder="text"
          @keydown.stop />
      </article>
    </div>
    <div
      v-if="node.widget"
      v-html="node.widget.html"
      class="tw-w-full tw-h-full"
      :class="{
        analyze: widgetStore.selectedUsingWidgetId === node.widget?.id
      }"></div>
    <template v-else>
      <p class="tw-w-full tw-text-center tw-text-slate-500">space</p>
      <draggable
        v-bind="dragOptions"
        :list="node.nodes"
        :id="`drag_${node.id}`"
        class="drag-area"
        :class="[flexClass, gridClass]"
        @start="startHandler"
        @end="endHandler">
        <Node
          v-for="child in node.nodes"
          :key="child.id"
          :node="child"
          @add-widget="emit('addWidget', $event)" />
      </draggable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePagesStore } from '../store/page.store'
import { computed, watch } from 'vue'
import { useScreenStore } from '../store/screen.store'
import type { ResponsiveMode } from '../model/Node'
import { Node as NodeType } from '../model/Node'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import { useWidgetStore } from '../store/widget.store'

const props = defineProps({
  node: {
    type: NodeType,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'addWidget', nodeId: string): void
}>()

const screenStore = useScreenStore()

const pageStore = usePagesStore()

const widgetStore = useWidgetStore()

const spacingClass = computed(() => (screenStore.isShowSpacing ? 'tw-p-2' : ''))

const outlineClass = computed(() =>
  screenStore.isShowOutline ? 'tw-border-1' : 'tw-border-0'
)

const selectedClass = computed(() =>
  pageStore.selectedNodeIds.includes(props.node.id)
    ? 'tw-border-orange-500'
    : 'tw-border-slate-500'
)

const gridClass = computed(() =>
  (<ResponsiveMode[]>Object.keys(props.node.layout)).reduce<string>(
    (acc, current) => {
      let result = ''
      if (props.node.layout[current].type === 'grid')
        result = result + `${current}:type-${props.node.layout[current].type} `
      if (props.node.layout[current].columns)
        result =
          result + `${current}:columns-${props.node.layout[current].columns} `
      return acc + result
    },
    ''
  )
)

const flexClass = computed(() =>
  (<ResponsiveMode[]>Object.keys(props.node.layout)).reduce<string>(
    (acc, current) => {
      let result = ''
      if (props.node.layout[current].direction === 'horizontal')
        result =
          result +
          `${current}:direction-${props.node.layout[current].direction} `
      if (props.node.layout[current].gap)
        result = result + `${current}:gap-${props.node.layout[current].gap} `
      if (props.node.layout[current].mainAxis !== undefined)
        result =
          result + `${current}:mainAxis-${props.node.layout[current].mainAxis} `
      if (props.node.layout[current].crossAxis !== undefined)
        result =
          result +
          `${current}:crossAxis-${props.node.layout[current].crossAxis} `

      return acc + result
    },
    ''
  )
)

const layoutClass = computed(() =>
  (<ResponsiveMode[]>Object.keys(props.node.layout)).reduce<string>(
    (acc, current) => {
      let result = ''
      if (props.node.layout[current].width)
        result =
          result + `${current}:width-${props.node.layout[current].width} `
      if (props.node.layout[current].height)
        result =
          result + `${current}:height-${props.node.layout[current].height} `
      if (props.node.layout[current].maxWidth)
        result =
          result + `${current}:maxWidth-${props.node.layout[current].maxWidth} `

      if (props.node.layout[current].position !== undefined)
        result =
          result + `${current}:position-${props.node.layout[current].position} `

      if (props.node.layout[current].hidden)
        result =
          result +
          `${current}:hidden-${props.node.layout[current].hidden || false} `

      if (props.node.layout[current].paddingLeft !== undefined)
        result =
          result +
          `${current}:padding-left-${props.node.layout[current].paddingLeft} `
      if (props.node.layout[current].paddingTop !== undefined)
        result =
          result +
          `${current}:padding-top-${props.node.layout[current].paddingTop} `
      if (props.node.layout[current].paddingRight !== undefined)
        result =
          result +
          `${current}:padding-right-${props.node.layout[current].paddingRight} `
      if (props.node.layout[current].paddingBottom !== undefined)
        result =
          result +
          `${current}:padding-bottom-${props.node.layout[current].paddingBottom} `

      if (props.node.layout[current].left !== undefined)
        result = result + `${current}:left-${props.node.layout[current].left} `
      if (props.node.layout[current].top !== undefined)
        result = result + `${current}:top-${props.node.layout[current].top} `
      if (props.node.layout[current].right !== undefined)
        result =
          result + `${current}:right-${props.node.layout[current].right} `
      if (props.node.layout[current].bottom !== undefined)
        result =
          result + `${current}:bottom-${props.node.layout[current].bottom} `

      if (props.node.layout[current].transparent)
        result = result + `${current}:transparent `

      if (props.node.layout[current].zIndex)
        result =
          result + `${current}:zIndex-${props.node.layout[current].zIndex} `

      return acc + result
    },
    ''
  )
)

const adjustMarkerBody = () =>
  setTimeout(() => {
    ;[...Array.from(document.body.getElementsByClassName('marker'))].forEach(
      element => {
        element.getBoundingClientRect().left > document.body.clientWidth / 2
          ? element.getElementsByTagName('article')[0].classList.add('right-1')
          : element.getElementsByTagName('article')[0].classList.add('left-1')

        element.getBoundingClientRect().top > document.body.clientHeight / 2
          ? element.getElementsByTagName('article')[0].classList.add('bottom-1')
          : element.getElementsByTagName('article')[0].classList.add('top-1')
      }
    )
  })

watch(
  () => pageStore.currentPage?.nodes,
  () => adjustMarkerBody(),
  { immediate: true, deep: true }
)

const dragOptions = {
  animation: 200,
  group: { name: 'g1' },
  disabled: false,
  ghostClass: 'ghost',
  draggable: '.draggable'
}

const startHandler = ($event: any) =>
  pageStore.dragNode('start', $event.item.id, $event.oldIndex)

const endHandler = ($event: any) =>
  pageStore.dragNode('end', $event.to.id, $event.newIndex)

const calculateMarkerPosition = ($event: MouseEvent) => {
  const target = <HTMLDivElement>$event.target
  const { left, top } = target.getBoundingClientRect()
  const isRight = left < document.body.offsetWidth / 2
  const isTop = top < document.body.offsetHeight / 2
  const x = isRight ? 0 : -100
  const y = isTop ? 0 : -100
  const article = target.getElementsByTagName('article')[0]
  if (article) article.style.transform = `translate(${x}%, ${y}%)`
}
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

.analyze {
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.5);

    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
