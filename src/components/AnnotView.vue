<script setup lang="ts">
import {reactive, ref, getCurrentInstance, ComponentInternalInstance} from 'vue'

import Nav from './Nav.vue'
import SideBar from './SideBar.vue'
import ConvDepView from '@/components/conv_dep/ConvDepView.vue'


const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
// @ts-ignore
const assigns = reactive(JSON.parse(proxy.$route.params.assigns))
// @ts-ignore
const finish_num = ref(JSON.parse(proxy.$route.params.finish_num))
// @ts-ignore
const assign_index = ref(Number(proxy.$route.params.assign_index))

function updateAssign(convId) {
  console.log(assigns)
  console.log(convId)
  for (let i = 0; i < assigns.length; i++) {
    if (assigns[i].item_id === convId) {
      assign_index.value = i
      break
    }
  }
  if (assigns[assign_index.value].status === 0) {
    assigns[assign_index.value].status = 2
    finish_num.value += 1
  }
  console.log(finish_num)
}
</script>

<template>
  <Nav page-now="/annot" :assigns="assigns" :finish_num="finish_num"></Nav>
  <div class="row">
    <div class="col">
        <SideBar> </SideBar>
    </div>
    <div class="col-10">
        <ConvDepView :assigns="assigns" :assign_index="assign_index" @update-assign="updateAssign"> </ConvDepView>
    </div>
  </div>
</template>

<style>

</style>
