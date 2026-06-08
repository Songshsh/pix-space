<script setup lang="ts">
import ImagePreviewDialog from '@/components/portal/ImagePreviewDialog.vue';
import ExploreDiscoverHeader from './ExploreDiscoverHeader.vue';
import ExploreMasonrySection from './ExploreMasonrySection.vue';
import ExploreSearchHeader from './ExploreSearchHeader.vue';
import { useExplorePreview } from './useExplorePreview';
import { useExploreView } from './useExploreView';

const {
  activeCategory,
  categories,
  searchTags,
  relatedSearches,
  filteredItems,
  searchQuery,
  isSearching,
  contentState,
  activeSort,
  activeSearchTag,
  setSearchQuery,
  backToExplore,
  retrySearch,
  setSort,
  setSearchTag,
  selectCategory,
  goToDetail,
  goToAuthorProfile,
} = useExploreView();

const {
  previewVisible,
  previewItem,
  canPreviewPrev,
  canPreviewNext,
  openPreview,
  handleViewDetail,
  showPrevPreview,
  showNextPreview,
} = useExplorePreview({
  items: filteredItems,
  onViewDetail: goToDetail,
});
</script>

<template>
  <div class="explore-page">
    <ExploreDiscoverHeader
      v-if="!isSearching"
      :categories="categories"
      :active-category="activeCategory"
      @select-category="selectCategory"
    />

    <ExploreSearchHeader
      v-else
      :search-query="searchQuery"
      :result-count="filteredItems.length"
      :active-sort="activeSort"
      :search-tags="searchTags"
      :active-search-tag="activeSearchTag"
      :related-searches="relatedSearches"
      @set-sort="setSort"
      @set-tag="setSearchTag"
      @set-query="setSearchQuery"
    />

    <ExploreMasonrySection
      :items="filteredItems"
      :state="contentState"
      :related-searches="relatedSearches"
      @open-preview="openPreview"
      @view-detail="handleViewDetail"
      @author-click="goToAuthorProfile"
      @set-query="setSearchQuery"
      @retry="retrySearch"
      @back="backToExplore"
    />
  </div>

  <ImagePreviewDialog
    v-model="previewVisible"
    :item="previewItem"
    :can-prev="canPreviewPrev"
    :can-next="canPreviewNext"
    @view-detail="handleViewDetail"
    @prev="showPrevPreview"
    @next="showNextPreview"
  />
</template>

<style scoped>
.explore-page {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
}
</style>
