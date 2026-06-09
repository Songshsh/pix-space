<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

interface BoardForm {
  name: string;
  description: string;
  visibility: 'public' | 'private';
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

const formRef = ref<FormInstance>();

const formRules: FormRules<BoardForm> = {
  name: [{ required: true, message: '请输入画板名称', trigger: 'blur' }],
};

const dialogTitle = computed(() =>
  props.mode === 'create' ? '新建画板' : '编辑画板'
);

const handleConfirm = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  form.value = {
    ...form.value,
    name: form.value.name.trim(),
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
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="画板名称" prop="name" required>
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
