<script setup lang="ts">
import { uploadImage } from '../../api/image';
import { useUserStore } from '../../stores/user';
import UploadDialog from '../common/UploadDialog.vue';

const props = defineProps<{
  redirectPath: string;
}>();

const router = useRouter();
const userStore = useUserStore();
const uploadDialogVisible = ref(false);

const goLogin = () => {
  router.push({ path: '/login', query: { redirect: props.redirectPath } });
};

const handleUpload = () => {
  if (!userStore.isAuthenticated) {
    goLogin();
    return;
  }
  uploadDialogVisible.value = true;
};
</script>

<template>
  <el-button type="primary" round class="upload-btn" @click="handleUpload">
    上传
  </el-button>

  <UploadDialog
    v-model:visible="uploadDialogVisible"
    title="上传图片"
    accept="image/*"
    tip="支持上传 JPG、PNG、GIF 等图片格式，单张不超过 10MB"
    warning-text="请选择要上传的图片"
    :upload-fn="uploadImage"
  />
</template>

<style scoped>
.upload-btn {
  padding: var(--ds-space-2) var(--ds-space-5);
  font-weight: 500;
}
</style>
