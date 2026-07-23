<template>
  <UploadDialog
    :visible="props.visible"
    title="上传文件"
    accept=""
    tip="支持上传任意类型文件，单个文件大小不超过 100MB"
    warning-text="请选择文件"
    :upload-fn="uploadCurrentFolder"
    @update:visible="$emit('update:visible', $event)"
    @success="$emit('uploaded')"
  />
</template>

<script setup lang="ts">
import UploadDialog from '@/components/common/UploadDialog.vue';
import { uploadFile } from '../../../api/file';

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'uploaded'): void;
}>();

const props = defineProps<{
  visible: boolean;
  parentId?: string | null;
}>();

const uploadCurrentFolder = (formData: FormData) => {
  return uploadFile(formData, props.parentId);
};
</script>
