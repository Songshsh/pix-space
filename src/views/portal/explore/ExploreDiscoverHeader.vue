<script setup lang="ts">
defineProps<{
  categories: string[];
  activeCategory: string;
}>();

const emit = defineEmits<{
  'select-category': [category: string];
}>();
</script>

<template>
  <div class="categories">
    <el-tag
      v-for="cat in categories"
      :key="cat"
      round
      :type="activeCategory === cat ? undefined : 'info'"
      :effect="activeCategory === cat ? 'dark' : 'plain'"
      class="category-tag"
      @click="emit('select-category', cat)"
    >
      {{ cat }}
    </el-tag>
  </div>
</template>

<style scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
  margin-bottom: var(--ds-space-2);
}

.category-tag {
  cursor: pointer;
}
</style>
