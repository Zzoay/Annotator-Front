
<script setup lang="ts">

defineProps<{ 
    showMessage: boolean,
}>()

</script>

<template>
    <!-- Modal -->
    <div v-show="showMessage">
        <div class="message-modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="title"></slot>
                        </h5>
                        <button type="button" class="close" @click="$emit('hide-message')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <!-- <div class="modal-footer">
                    </div> -->
                </div>
            </div>
        </div>
        <div class="confirm-modal-backdrop"></div>
    </div>
</template>

<style scoped>
.message-modal {
    position: fixed;
    top: 300px;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
}
.message-modal-backdrop {
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