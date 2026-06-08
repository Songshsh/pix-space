<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number;
  }>(),
  {
    count: 3,
  }
);
</script>

<template>
  <div class="masonry-grid">
    <div v-for="i in count" :key="i" class="masonry-item">
      <div class="masonry-card masonry-card--skeleton">
        <div class="skeleton-block skeleton-block--board-cover"></div>
        <div class="skeleton-panel skeleton-stack">
          <div class="skeleton-line skeleton-line--sm"></div>
          <div class="skeleton-line skeleton-line--xs"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.masonry-card--skeleton {
  cursor: default;
}

.masonry-card--skeleton:hover {
  transform: none;
}
</style>
