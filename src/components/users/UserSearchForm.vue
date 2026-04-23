<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import type { UserSearchForm } from '../../types/user';

const modelValue = defineModel<UserSearchForm>({ required: true });

const emit = defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
}>();
</script>

<template>
  <el-card class="search-card">
    <el-form :inline="true" :model="modelValue" class="search-form">
      <el-form-item label="用户名">
        <el-input
          v-model="modelValue.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="modelValue.email"
          placeholder="请输入邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="modelValue.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="emit('search')">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="emit('reset')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
