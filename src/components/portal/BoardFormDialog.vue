<script setup lang="ts">
interface BoardForm {
  name: string;
  description: string;
  visibility: string;
}

const visible = defineModel<boolean>('visible', { required: true });
const form = defineModel<BoardForm>('form', { required: true });

const props = defineProps<{
  mode: 'create' | 'edit';
  submitting?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const dialogTitle = computed(() =>
  props.mode === 'create' ? '新建画板' : '编辑画板'
);

const handleConfirm = () => {
  const name = form.value.name.trim();
  if (!name) {
    ElMessage.warning('请输入画板名称');
    return;
  }
  form.value = {
    ...form.value,
    name,
    description: form.value.description.trim(),
  };
  emit('confirm');
};
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    class="board-dialog"
  >
    <el-form label-position="top" :model="form">
      <el-form-item label="画板名称" required>
        <el-input
          v-model="form.name"
          placeholder="请输入画板名称"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="画板描述">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="简要描述画板内容（选填）"
          :rows="3"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="可见性">
        <el-radio-group v-model="form.visibility">
          <el-radio value="public">公开</el-radio>
          <el-radio value="private">私有</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button round @click="visible = false">取消</el-button>
        <el-button
          round
          type="primary"
          :loading="submitting"
          @click="handleConfirm"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-space-2);
}
</style>
