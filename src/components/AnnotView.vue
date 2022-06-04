<script setup lang="ts">
import {reactive, ref} from 'vue'

import Nav from './Nav.vue'
import SideBar from './SideBar.vue'
import ConvDepView from '@/components/conv_dep/ConvDepView.vue'

</script>

<template>
  <Nav page-now="/annot"></Nav>
  <div class="row">
    <div class="col">
        <SideBar> </SideBar>
    </div>
    <div class="col-10">
        <ConvDepView> </ConvDepView>
    </div>
  </div>
</template>

<style>

</style>
