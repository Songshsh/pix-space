<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
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
        <el-button @click="visible = false">取消</el-button>
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
  title: string;
  accept: string;
  tip: string;
  warningText: string;
  maxSize?: number;
  uploadFn: (formData: FormData) => Promise<unknown>;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const visible = defineModel<boolean>('visible', { required: true });

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

  // 前端文件校验
  const maxSize = props.maxSize || 100; // MB
  const allowedTypes = props.accept
    ? props.accept.split(',').map((t) => t.trim())
    : [];
  for (const file of files.value) {
    const rawSize = file.raw?.size ?? file.size;
    if (rawSize && rawSize > maxSize * 1024 * 1024) {
      ElMessage.warning(
        `文件 "${file.name}" 超过大小限制（最大 ${maxSize}MB）`
      );
      return;
    }
    if (allowedTypes.length > 0) {
      const rawType = file.raw?.type || '';
      const isAllowed = allowedTypes.some((at) => {
        if (at.startsWith('.')) {
          return file.name.toLowerCase().endsWith(at.toLowerCase());
        }
        return rawType && rawType.match(new RegExp(at.replace('*', '.*')));
      });
      if (!isAllowed) {
        ElMessage.warning(`文件 "${file.name}" 类型不支持`);
        return;
      }
    }
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
    visible.value = false;
  } catch (error) {
    ElMessage.error('上传失败，请稍后重试');
    throw error;
  } finally {
    uploading.value = false;
  }
};

watch(visible, (val) => {
  if (!val) {
    resetUploadState();
  }
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-space-2);
}
</style>
