<template>
  <aside class="tw-w-96 tw-h-full | tw-border-l tw-overflow-auto | tw-flex tw-flex-col">
    <ConfigWidgetAnalyzePanel v-if="screenStore.screenMode === 'analyzeWidget'"/>
    <template v-else>
      <ConfigNodePanelAdd/>
      <ConfigNodePanelLayout/>
    </template>
    <div v-if="isShowAD" 
         class="tw-relative | tw-mt-auto tw-mx-auto tw-pb-3 | tw-flex tw-align-center tw-justify-center"
         style="width: 250px; aspect-ratio: 1;" >
      <button class="tw-flex | tw-m-1 | tw-absolute tw-top-0 tw-left-0 tw-z-9 | tw-bg-white"       
              title="Close AD"
              @click="closeAD">
        <i class="mm-icon mm-icon-close"></i>
      </button>
      <iframe width="250" height="250" allowtransparency="true" src="https://tab2.clickmon.co.kr/pop/wp_ad_250.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1138899%7C%5E%7CAdver_M_1046207&mon_rf=REFERRER_URL&mon_direct_url=URLENCODE_PASSBACK_INPUT" frameborder="0" scrolling="no"></iframe>    
    </div>
  </aside>
</template>

<script setup lang="ts">
import ConfigNodePanelAdd from "./ConfigNodePanelAdd.vue"
import ConfigNodePanelLayout from "./ConfigNodePanelLayout.vue"
import ConfigWidgetAnalyzePanel from "./ConfigWidgetAnalyzePanel.vue"
import {useScreenStore} from "../store/screen.store"
import {ref} from "vue"

const screenStore = useScreenStore()

const isShowAD = ref(true)
const closeAD = () => isShowAD.value = false
</script>

<style scoped>

</style>