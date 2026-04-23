<template>
  <el-dialog
    :model-value="visible"
    title="新建文件夹"
    width="400px"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form>
      <el-form-item label="文件夹名称">
        <el-input
          :model-value="name"
          placeholder="请输入文件夹名称"
          @update:model-value="emit('update:name', $event)"
          @keyup.enter="emit('confirm')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="emit('confirm')">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  name: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'update:name', value: string): void;
  (e: 'confirm'): void;
}>();
</script>
