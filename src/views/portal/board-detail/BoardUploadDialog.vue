<script setup lang="ts">
import type { UploadFile, UploadInstance } from 'element-plus';

interface UploadFileItem {
  id: string;
  name: string;
  size: string;
  raw: File;
}

const MAX_FILES = 50;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  submitting?: boolean;
}>();

const emit = defineEmits<{
  confirm: [files: File[]];
}>();

const uploadRef = ref<UploadInstance>();
const uploadFileList = ref<UploadFileItem[]>([]);
const confirmDisabled = computed(
  () => uploadFileList.value.length === 0 || Boolean(props.submitting)
);

const buildFileKey = (file: File) => {
  return `${file.name}_${file.size}_${file.lastModified}`;
};

const handleUploadChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    ElMessage.warning(`《${file.name}》不是支持的图片格式，已跳过`);
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    ElMessage.warning(`《${file.name}》超过 10MB，已跳过`);
    return;
  }

  if (uploadFileList.value.length >= MAX_FILES) {
    ElMessage.warning('最多上传 50 张图片');
    return;
  }

  const fileKey = buildFileKey(file);
  if (uploadFileList.value.some((item) => buildFileKey(item.raw) === fileKey)) {
    ElMessage.info(`《${file.name}》已在上传列表中`);
    return;
  }

  uploadFileList.value.push({
    id: `${fileKey}_${Date.now()}`,
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    raw: file,
  });
};

const handleRemoveFile = (id: string) => {
  uploadFileList.value = uploadFileList.value.filter((f) => f.id !== id);
  uploadRef.value?.clearFiles();
};

const handleClearFiles = () => {
  uploadFileList.value = [];
  uploadRef.value?.clearFiles();
};

const handleUploadConfirm = () => {
  emit(
    'confirm',
    uploadFileList.value.map((item) => item.raw)
  );
};

watch(visible, (val) => {
  if (!val) {
    handleClearFiles();
  }
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="上传到画板"
    width="800px"
    :close-on-click-modal="false"
    class="board-upload-dialog"
  >
    <el-upload
      ref="uploadRef"
      drag
      multiple
      accept=".jpg,.jpeg,.png,.gif,.webp"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleUploadChange"
      class="upload-dropzone"
    >
      <div class="dropzone-content">
        <div class="dropzone-icon">📁</div>
        <div class="dropzone-title">拖拽图片到此处</div>
        <div class="dropzone-or">或</div>
        <el-button round size="small" plain>选择文件</el-button>
      </div>
    </el-upload>
    <div class="upload-hint">
      支持 JPG / PNG / GIF / WebP，单张不超过 10MB，最多 50 张
    </div>

    <template v-if="uploadFileList.length > 0">
      <div class="file-list-header">
        <span class="file-count"
          >已选择 {{ uploadFileList.length }} 张图片</span
        >
        <el-button
          link
          type="primary"
          class="clear-all"
          @click="handleClearFiles"
        >
          清空
        </el-button>
      </div>
      <div class="file-list">
        <div v-for="file in uploadFileList" :key="file.id" class="file-item">
          <div class="file-thumb">🖼️</div>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ file.size }}</div>
          </div>
          <div class="file-state">
            <span class="file-state-badge">待上传</span>
          </div>
          <el-button
            link
            type="danger"
            class="file-remove"
            @click="handleRemoveFile(file.id)"
          >
            移除
          </el-button>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="upload-footer">
        <span v-if="uploadFileList.length > 0" class="upload-total">
          共 {{ uploadFileList.length }} 张
        </span>
        <span class="upload-footer-spacer"></span>
        <div class="upload-footer-actions">
          <el-button round @click="visible = false">取消</el-button>
          <el-button
            round
            type="primary"
            :loading="submitting"
            :disabled="confirmDisabled"
            @click="handleUploadConfirm"
          >
            开始上传
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.upload-dropzone :deep(.el-upload-dragger) {
  border: 2px dashed var(--ds-color-border);
  border-radius: var(--ds-radius-3);
  padding: var(--ds-space-8) 0;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ds-space-2);
}

.dropzone-icon {
  font-size: 40px;
}

.dropzone-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ds-color-text-primary);
}

.dropzone-or {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.upload-hint {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  margin-top: var(--ds-space-3);
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--ds-space-5);
}

.file-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--ds-color-text-primary);
}

.clear-all {
  font-size: 12px;
  color: var(--el-color-danger);
  cursor: pointer;
}

.file-list {
  margin-top: var(--ds-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-2);
}

.file-thumb {
  width: 48px;
  height: 48px;
  background-color: var(--ds-color-bg-secondary);
  border-radius: var(--ds-radius-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: var(--ds-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.file-size {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.file-state {
  font-size: 12px;
  white-space: nowrap;
  min-width: 72px;
  text-align: right;
}

.file-state-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 24px;
  padding: 0 var(--ds-space-2);
  border-radius: var(--ds-radius-pill);
  background-color: var(--ds-color-bg-secondary);
  color: var(--ds-color-text-tertiary);
}

.file-remove {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  cursor: pointer;
  padding: var(--ds-space-1);
}

.file-remove:hover {
  color: var(--ds-color-text-primary);
}

.upload-footer {
  display: flex;
  align-items: center;
  width: 100%;
}

.upload-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ds-space-2);
}

.upload-total {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.upload-footer-spacer {
  flex: 1;
}
</style>
