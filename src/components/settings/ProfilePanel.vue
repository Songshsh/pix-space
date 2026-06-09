<template>
  <div class="profile-panel">
    <h3 class="section-title">个人资料</h3>
    <el-form :model="profileForm" label-width="100px" class="settings-form">
      <el-form-item label="头像">
        <div class="avatar-upload">
          <el-avatar :size="80" :src="profileForm.avatar" :icon="UserFilled" />
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-file-input"
            @change="handleFileChange"
          />
          <el-button
            type="primary"
            size="small"
            class="avatar-upload-btn"
            @click="openFilePicker"
          >
            更换头像
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="profileForm.username" class="field-input" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="profileForm.email" class="field-input" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="profileForm.phone" class="field-input" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          v-model="profileForm.bio"
          type="textarea"
          :rows="4"
          class="field-input"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="emit('save')"
          >保存修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import type { ProfilePanelForm } from './types';

defineProps<{
  saving?: boolean;
}>();

const emit = defineEmits<{
  save: [];
  avatarChange: [file: File];
}>();

const profileForm = defineModel<ProfilePanelForm>('profile', {
  required: true,
});

const fileInputRef = ref<HTMLInputElement>();

const openFilePicker = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 文件大小校验（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('头像文件大小不能超过 5MB');
    input.value = '';
    return;
  }

  // 文件类型校验
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件');
    input.value = '';
    return;
  }

  emit('avatarChange', file);
  input.value = '';
};
</script>

<style scoped>
.settings-form {
  max-width: 600px;
}

.avatar-upload {
  display: flex;
  align-items: center;
}

.avatar-upload-btn {
  margin-left: var(--ds-space-4);
}

.hidden-file-input {
  display: none;
}

.field-input {
  max-width: 400px;
}
</style>
