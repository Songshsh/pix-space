<script setup lang="ts">
defineProps<{
  searchQuery: string;
  resultCount: number;
  activeSort: 'newest' | 'hot';
  searchTags: string[];
  activeSearchTag: string;
  relatedSearches: string[];
}>();

const emit = defineEmits<{
  'set-sort': [sort: 'newest' | 'hot'];
  'set-tag': [tag: string];
  'set-query': [query: string];
}>();
</script>

<template>
  <div class="search-header">
    <div class="result-bar">
      <div class="result-info">
        <div class="result-title">“{{ searchQuery }}”</div>
        <div class="result-count">共 {{ resultCount }} 个结果</div>
      </div>
      <el-radio-group
        :model-value="activeSort"
        size="small"
        class="sort-toggle"
        @change="
          (val: string | number | boolean | undefined) =>
            emit('set-sort', val as 'newest' | 'hot')
        "
      >
        <el-radio-button value="newest">最新</el-radio-button>
        <el-radio-button value="hot">最热</el-radio-button>
      </el-radio-group>
    </div>

    <div class="categories search-categories">
      <el-tag
        v-for="tag in searchTags"
        :key="tag"
        round
        :type="activeSearchTag === tag ? undefined : 'info'"
        :effect="activeSearchTag === tag ? 'dark' : 'plain'"
        class="category-tag"
        @click="emit('set-tag', tag)"
      >
        {{ tag }}
      </el-tag>
    </div>

    <div class="related-bar">
      <div class="related-title">相关搜索</div>
      <div class="related-items">
        <el-tag
          v-for="term in relatedSearches"
          :key="term"
          round
          type="info"
          effect="plain"
          class="related-pill"
          @click="emit('set-query', term)"
        >
          {{ term }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-header {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
  margin-bottom: var(--ds-space-2);
}

.search-categories {
  margin-bottom: 0;
}

.category-tag {
  cursor: pointer;
}

.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.result-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  line-height: 1;
}

.result-count {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  line-height: 1;
}

.sort-toggle {
  width: auto;
}

.related-bar {
  height: 56px;
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  padding: 0 var(--ds-space-4);
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.related-title {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  white-space: nowrap;
}

.related-items {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  overflow: hidden;
}
</style>
