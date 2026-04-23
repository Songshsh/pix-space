<template>
  <el-card class="activity-card">
    <template #header>
      <span>最近活动</span>
    </template>
    <el-timeline>
      <el-timeline-item
        v-for="activity in activities"
        :key="activity.time + activity.content"
        :timestamp="activity.time"
        :type="activity.type || undefined"
        placement="top"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup lang="ts">
import type { RecentActivity } from '../../types/dashboard';

defineProps<{
  activities: RecentActivity[];
}>();
</script>

<style scoped>
.activity-card {
  margin-bottom: 16px;
}
</style>
