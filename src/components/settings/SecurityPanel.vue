<template>
  <div class="security-panel">
    <h3 class="section-title">安全设置</h3>
    <el-form :model="securityForm" label-width="100px" class="settings-form">
      <el-form-item label="当前密码">
        <el-input
          v-model="securityForm.currentPassword"
          type="password"
          show-password
          style="max-width: 400px"
        />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="securityForm.newPassword"
          type="password"
          show-password
          style="max-width: 400px"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="securityForm.confirmPassword"
          type="password"
          show-password
          style="max-width: 400px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangePassword"
          >修改密码</el-button
        >
      </el-form-item>
    </el-form>

    <el-divider />

    <h4 class="subsection-title">两步验证</h4>
    <div class="two-factor">
      <div class="two-factor-info">
        <p>启用两步验证可以提高账户安全性</p>
        <el-tag :type="securityForm.twoFactorEnabled ? 'success' : 'info'">
          {{ securityForm.twoFactorEnabled ? '已启用' : '未启用' }}
        </el-tag>
      </div>
      <el-switch
        v-model="securityForm.twoFactorEnabled"
        @change="handleTwoFactorChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false,
});

const handleChangePassword = () => {
  if (!securityForm.currentPassword || !securityForm.newPassword) {
    ElMessage.warning('请填写完整的密码信息');
    return;
  }
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }
  ElMessage.success('密码修改成功');
  securityForm.currentPassword = '';
  securityForm.newPassword = '';
  securityForm.confirmPassword = '';
};

const handleTwoFactorChange = (value: string | number | boolean) => {
  ElMessage.success(value ? '两步验证已启用' : '两步验证已关闭');
};
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
}

.settings-form {
  max-width: 600px;
}

.two-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.two-factor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.two-factor-info p {
  margin: 0;
  color: #666;
}
</style>
