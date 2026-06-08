<template>
  <UploadDialog
    :visible="visible"
    title="上传图片"
    accept="image/*"
    tip="支持 JPG、PNG、GIF 格式，单张图片不超过 10MB"
    warning-text="请选择图片"
    :upload-fn="uploadImage"
    @update:visible="$emit('update:visible', $event)"
    @success="$emit('uploaded')"
  />
</template>

<script setup lang="ts">
import UploadDialog from '@/components/common/UploadDialog.vue';
import { uploadImage } from '../../../api/image';

defineProps<{
  visible: boolean;
}>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'uploaded'): void;
}>();
</script>
