<template>
  <div class="profile-panel">
    <h3 class="section-title">个人资料</h3>
    <el-form :model="profileForm" label-width="100px" class="settings-form">
      <el-form-item label="头像">
        <div class="avatar-upload">
          <el-avatar :size="80" :icon="UserFilled" />
          <el-button type="primary" size="small" class="avatar-upload-btn">
            更换头像
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="profileForm.username" style="max-width: 400px" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="profileForm.email" style="max-width: 400px" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="profileForm.phone" style="max-width: 400px" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          v-model="profileForm.bio"
          type="textarea"
          :rows="4"
          style="max-width: 400px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSaveProfile"
          >保存修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

const profileForm = reactive({
  username: userStore.name || '',
  email: userStore.email || '',
  phone: '',
  bio: '',
});

const handleSaveProfile = () => {
  ElMessage.info('保存个人资料功能开发中');
};
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-5) 0;
}

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
</style>
