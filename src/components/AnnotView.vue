<script setup lang="ts">
import {reactive, ref, getCurrentInstance, ComponentInternalInstance} from 'vue'

import Nav from './Nav.vue'
import SideBar from './SideBar.vue'
import ConvDepView from '@/components/conv_dep/ConvDepView.vue'


const { proxy } = (getCurrentInstance() as ComponentInternalInstance)

const assigns = reactive(JSON.parse(window.sessionStorage.assigns))
const finish_num = ref(JSON.parse(window.sessionStorage.finish_num))
const assign_index = ref(Number(window.sessionStorage.assign_index))

function updateAssign(assignIdx) {
  // for (let i = 0; i < assigns.length; i++) {
  //   if (assigns[i].item_id === convId) {
  //     assign_index.value = i
  //     break
  //   }
  // }
  assign_index.value = assignIdx
  if (assigns[assign_index.value].status === 0) {
    assigns[assign_index.value].status = 2
    finish_num.value += 1
  }
  window.sessionStorage.assigns = JSON.stringify(assigns)
  window.sessionStorage.finish_num = JSON.stringify(finish_num.value)
}
// console.log(finish_num)
</script>

<template>
  <Nav page-now="/annot" :assigns="assigns" :finish_num="finish_num"></Nav>
  <div class="row">
    <div class="col-1">
        <SideBar> </SideBar>
    </div>
    <div class="col-11">
        <ConvDepView :assigns="assigns" :assign_index="assign_index" :finish_num="finish_num" @update-assign="updateAssign"> </ConvDepView>
    </div>
  </div>
</template>

<style>

</style>
