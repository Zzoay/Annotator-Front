
<script setup lang="ts">

defineProps<{ 
    showModal: boolean,
    nextPrev: boolean,
}>()

</script>

<template>
    <!-- Modal -->
    <div v-show="showModal">
        <div class="confirm-modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="title"></slot>
                        </h5>
                        <button type="button" class="close" @click="$emit('hide-modal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="$emit('hide-modal')">取消</button>
                        <button type="button" 
                                class="btn " 
                                :class="nextPrev ? 'btn-warning' : 'btn-primary' " 
                                @click="$emit('do-action')"
                                @keyup.enter.prevent="$emit('do-action')">
                            确定
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="confirm-modal-backdrop"></div>
    </div>
</template>

<style scoped>
.confirm-modal {
    position: fixed;
    top: 320px;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
}
.confirm-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: .5;
}

.close {
    background-color: #fff;
    border:none;
    font-size: 20px;
}
</style>