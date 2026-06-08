<script setup lang="ts">
import BoardSelectDialog from '../../../components/common/BoardSelectDialog.vue';
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import { useUserStore } from '../../../stores/user';
import ImageDetailSidebar from './ImageDetailSidebar.vue';
import ImageDetailStage from './ImageDetailStage.vue';
import { useImageDetailActions } from './useImageDetailActions';
import { useImageDetailView } from './useImageDetailView';

const userStore = useUserStore();

const {
  route,
  router,
  imageDetail,
  viewState,
  loadError,
  imageMetaData,
  loadDetail,
  handleRetry,
  handleBack,
} = useImageDetailView();

const {
  collecting,
  downloading,
  liking,
  boardPickerVisible,
  boardPickerLoading,
  boardPickerBoards,
  selectedBoardId,
  handleBoardPickerConfirm,
  handleBoardPickerCancel,
  handleCollect,
  handleDownload,
  handleLike,
  handleShare,
} = useImageDetailActions({
  imageDetail,
  route,
  router,
  userStore,
});

const retryLoadDetail = () => {
  handleRetry();
};

const refreshDetailAfterCollect = async () => {
  const collected = await handleCollect();
  if (collected && imageDetail.value) {
    await loadDetail();
  }
};

const goAuthorProfile = () => {
  const authorId = imageDetail.value?.author.id;
  if (!authorId) return;
  router.push({ path: `/u/${authorId}/boards` });
};
</script>

<template>
  <div class="image-detail-page">
    <div v-if="viewState === 'success'" class="detail-card">
      <ImageDetailStage :image-detail="imageDetail" />
      <ImageDetailSidebar
        :image-detail="imageDetail"
        :image-meta-data="imageMetaData"
        :collecting="collecting"
        :downloading="downloading"
        :liking="liking"
        @collect="refreshDetailAfterCollect"
        @download="handleDownload"
        @like="handleLike"
        @share="handleShare"
        @author-click="goAuthorProfile"
      />
    </div>

    <PageStateBlock
      v-else-if="viewState === 'loading'"
      variant="loading"
      description="加载中"
    />

    <PageStateBlock
      v-else-if="viewState === 'error'"
      variant="error"
      title="加载失败"
      :description="loadError || '网络或服务异常，请稍后重试'"
      primary-text="重试"
      secondary-text="返回发现"
      @primary="retryLoadDetail"
      @secondary="handleBack"
    />

    <PageStateBlock
      v-else-if="viewState === 'forbidden'"
      variant="forbidden"
      title="暂无访问权限"
      description="该图片为私有，仅作者可见"
      secondary-text="返回发现"
      @secondary="handleBack"
    />

    <PageStateBlock
      v-else-if="viewState === 'notfound'"
      variant="notfound"
      title="图片不存在"
      description="该素材可能已被删除或移动"
      secondary-text="返回发现"
      @secondary="handleBack"
    />

    <BoardSelectDialog
      v-model:visible="boardPickerVisible"
      v-model:selected-board-id="selectedBoardId"
      :boards="boardPickerBoards"
      :loading="boardPickerLoading"
      @confirm="handleBoardPickerConfirm"
      @cancel="handleBoardPickerCancel"
    />
  </div>
</template>

<style scoped>
.image-detail-page {
  width: 100%;
  min-height: calc(100vh - 64px);
}

.detail-card {
  display: flex;
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-1);
  overflow: hidden;
}

@media (max-width: 1280px) {
  .detail-card {
    flex-direction: column;
  }
}
</style>
