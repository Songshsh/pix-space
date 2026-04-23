<script setup lang="ts">
import { usePermission } from '../../composables/usePermission';
import { Plus } from '@element-plus/icons-vue';
import type { User, Pagination } from '../../types/user';

defineProps<{
  tableData: User[];
  loading: boolean;
}>();

const { hasPermission } = usePermission();
const canEdit = hasPermission(['admin']);

const pagination = defineModel<Pagination>('pagination', { required: true });

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'edit', row: User): void;
  (e: 'delete', row: User): void;
  (e: 'statusChange', row: User): void;
  (e: 'viewPermissions', row: User): void;
  (e: 'sizeChange', size: number): void;
  (e: 'currentChange', page: number): void;
}>();

const ROLE_TYPES: Record<
  string,
  'primary' | 'success' | 'warning' | 'info' | 'danger'
> = {
  管理员: 'danger',
  编辑: 'warning',
  用户: 'info',
};

const getRoleType = (role: string) => {
  return ROLE_TYPES[role] || 'info';
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>用户列表</span>
        <el-button v-if="canEdit" type="primary" @click="emit('add')">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="avatar" label="头像" width="80">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar">
            {{ row.username.charAt(0).toUpperCase() }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="active"
            inactive-value="inactive"
            @change="emit('statusChange', row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="canEdit"
            type="primary"
            link
            size="small"
            @click="emit('edit', row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            size="small"
            @click="emit('viewPermissions', row)"
          >
            权限
          </el-button>
          <el-button
            v-if="canEdit"
            type="danger"
            link
            size="small"
            @click="emit('delete', row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="emit('sizeChange', $event)"
        @current-change="emit('currentChange', $event)"
      />
    </div>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
