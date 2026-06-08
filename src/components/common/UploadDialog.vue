<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-upload
      ref="uploadRef"
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleFileChange"
      :accept="accept"
      multiple
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          {{ tip }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="confirmUpload">
          开始上传
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus';

const props = defineProps<{
  visible: boolean;
  title: string;
  accept: string;
  tip: string;
  warningText: string;
  uploadFn: (formData: FormData) => Promise<unknown>;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

const uploading = ref(false);
const files = ref<UploadFile[]>([]);
const uploadRef = ref<UploadInstance>();

const handleFileChange = (_file: UploadFile, uploadFiles: UploadFiles) => {
  files.value = uploadFiles;
};

const resetUploadState = () => {
  files.value = [];
  uploadRef.value?.clearFiles();
};

const confirmUpload = async () => {
  const selectedFiles = files.value
    .map((file) => file.raw)
    .filter((raw) => raw !== undefined);

  if (!selectedFiles.length) {
    ElMessage.warning(props.warningText);
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file as Blob);
    });

    await props.uploadFn(formData);
    ElMessage.success('上传成功');
    resetUploadState();
    emit('success');
    emit('update:visible', false);
  } catch {
    void 0;
  } finally {
    uploading.value = false;
  }
};

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      resetUploadState();
    }
  }
);
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-space-2);
}
</style>
