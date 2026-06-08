<script setup lang="ts">
import type { Board } from '../../types/user-boards';

const visible = defineModel<boolean>('visible', { required: true });
const selectedBoardId = defineModel<string>('selectedBoardId', {
  required: true,
});

const props = defineProps<{
  boards: Board[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const confirmDisabled = computed(() => !selectedBoardId.value);

const handleClose = () => {
  emit('cancel');
};
</script>

<template>
  <el-dialog
    v-model="visible"
    title="采集到画板"
    width="480px"
    :close-on-click-modal="false"
    class="board-select-dialog"
    @close="handleClose"
  >
    <el-form label-position="top">
      <el-form-item label="目标画板">
        <el-select
          v-model="selectedBoardId"
          placeholder="请选择目标画板"
          :loading="props.loading"
          class="board-select"
        >
          <el-option
            v-for="board in props.boards"
            :key="board.id"
            :label="board.title"
            :value="board.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button round @click="emit('cancel')">取消</el-button>
        <el-button
          round
          type="primary"
          :disabled="confirmDisabled"
          @click="emit('confirm')"
        >
          采集
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.board-select {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-space-2);
}
</style>
