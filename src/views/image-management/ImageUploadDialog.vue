<template>
  <el-dialog
    :model-value="visible"
    title="上传图片"
    width="500px"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-upload
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleFileChange"
      accept="image/*"
      multiple
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          支持 JPG、PNG、GIF 格式，单张图片不超过 10MB
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="uploading" @click="confirmUpload">
        开始上传
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import type { UploadFile, UploadFiles } from 'element-plus';
import { uploadImage } from '../../api/image';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'uploaded'): void;
}>();

const uploading = ref(false);
const files = ref<UploadFile[]>([]);

const handleFileChange = (_file: UploadFile, uploadFiles: UploadFiles) => {
  files.value = uploadFiles;
};

const confirmUpload = async () => {
  const selectedFiles = files.value
    .map((file) => file.raw)
    .filter((raw) => raw !== undefined);

  if (!selectedFiles.length) {
    ElMessage.warning('请选择图片');
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file as Blob);
    });

    await uploadImage(formData, { silentError: true });
    ElMessage.success('上传成功');
    files.value = [];
    emit('uploaded');
    emit('update:visible', false);
  } catch {
    ElMessage.error('上传失败，请稍后重试');
  } finally {
    uploading.value = false;
  }
};
</script>
