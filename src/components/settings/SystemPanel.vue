<template>
  <div class="system-panel">
    <h3 class="section-title">系统设置</h3>
    <el-form label-width="120px" class="settings-form">
      <el-form-item label="语言">
        <el-select v-model="systemSettings.language" style="width: 200px">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>
      <el-form-item label="时区">
        <el-select v-model="systemSettings.timezone" style="width: 200px">
          <el-option label="北京时间 (GMT+8)" value="Asia/Shanghai" />
          <el-option label="UTC" value="UTC" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期格式">
        <el-select v-model="systemSettings.dateFormat" style="width: 200px">
          <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
          <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
          <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
        </el-select>
      </el-form-item>
      <el-form-item label="自动备份">
        <el-switch v-model="systemSettings.autoBackup" />
        <span style="margin-left: 8px; color: #666">每天自动备份数据</span>
      </el-form-item>
    </el-form>

    <el-divider />

    <h4 class="subsection-title">危险操作</h4>
    <div class="danger-zone">
      <div class="danger-item">
        <div>
          <p class="danger-title">清除缓存</p>
          <p class="danger-desc">清除系统缓存，可能会影响加载速度</p>
        </div>
        <el-button @click="handleClearCache">清除缓存</el-button>
      </div>
      <div class="danger-item">
        <div>
          <p class="danger-title">导出数据</p>
          <p class="danger-desc">导出所有个人数据</p>
        </div>
        <el-button @click="handleExportData">导出数据</el-button>
      </div>
      <div v-if="canEdit" class="danger-item danger">
        <div>
          <p class="danger-title">删除账户</p>
          <p class="danger-desc">永久删除您的账户和所有数据，此操作不可逆</p>
        </div>
        <el-button type="danger" @click="handleDeleteAccount"
          >删除账户</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermission } from '../../composables/usePermission';

const { hasPermission } = usePermission();
const canEdit = hasPermission(['admin']);

const systemSettings = reactive({
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  autoBackup: true,
});

const handleClearCache = () => {
  ElMessageBox.confirm('确定要清除缓存吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('缓存已清除');
    })
    .catch((action: string) => {
      if (action !== 'cancel') ElMessage.error('操作失败');
    });
};

const handleExportData = () => {
  ElMessage.success('数据导出中，请稍候...');
};

const handleDeleteAccount = () => {
  ElMessageBox.confirm(
    '此操作将永久删除您的账户和所有数据，是否继续？',
    '危险操作',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
    .then(() => {
      ElMessage.success('账户删除请求已提交');
    })
    .catch((action: string) => {
      if (action !== 'cancel') ElMessage.error('操作失败');
    });
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

.danger-zone {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.danger-item.danger {
  background: #fef2f2;
}

.danger-title {
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.danger-desc {
  font-size: 13px;
  color: #999;
  margin: 0;
}
</style>
