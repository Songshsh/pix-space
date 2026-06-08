<script setup lang="ts">
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import BoardFormDialog from '../../../components/portal/BoardFormDialog.vue';
import BoardUploadDialog from './BoardUploadDialog.vue';
import BoardDetailGallery from './BoardDetailGallery.vue';
import BoardDetailHeader from './BoardDetailHeader.vue';
import BoardDetailLoadingGrid from './BoardDetailLoadingGrid.vue';
import { useBoardDetailActions } from './useBoardDetailActions';
import { useBoardDetailView } from './useBoardDetailView';

const {
  boardDetail,
  authorMeta,
  images,
  viewState,
  loadError,
  loadDetail,
  goBack,
  goAuthorProfile,
  goImageDetail,
} = useBoardDetailView();

const {
  editDialogVisible,
  editDialogSubmitting,
  editDialogForm,
  uploadDialogVisible,
  uploadDialogSubmitting,
  handleEditBoard,
  handleEditDialogConfirm,
  handleUploadToBoard,
  handleUploadConfirm,
} = useBoardDetailActions({
  boardDetail,
  loadDetail,
});

const handleRetry = () => {
  void loadDetail();
};
</script>

<template>
  <div class="board-detail-page">
    <BoardDetailHeader
      :view-state="viewState"
      :board-detail="boardDetail"
      :author-meta="authorMeta"
      @back="goBack"
      @author-click="goAuthorProfile"
      @edit="handleEditBoard"
      @upload="handleUploadToBoard"
    />

    <BoardDetailGallery
      v-if="viewState === 'success'"
      :items="images"
      @view-detail="goImageDetail"
    />

    <BoardDetailLoadingGrid v-else-if="viewState === 'loading'" />

    <PageStateBlock
      v-else-if="viewState === 'empty'"
      variant="empty"
      icon="🖼️"
      title="暂无图片"
      description="上传或采集图片到这个画板"
    />

    <PageStateBlock
      v-else-if="viewState === 'error'"
      variant="error"
      icon="⚠️"
      title="加载失败"
      :description="loadError || '网络或服务异常，请稍后重试'"
      primary-text="重试"
      @primary="handleRetry"
    />

    <PageStateBlock
      v-else-if="viewState === 'forbidden'"
      variant="forbidden"
      icon="🔒"
      title="无权限访问"
      description="该画板为私有，仅创建者可见"
      primary-text="返回"
      @primary="goBack"
    />

    <PageStateBlock
      v-else-if="viewState === 'notfound'"
      variant="notfound"
      icon="🗂️"
      title="画板不存在"
      description="该画板可能已被删除或移动"
      primary-text="返回"
      @primary="goBack"
    />

    <BoardFormDialog
      v-model:visible="editDialogVisible"
      v-model:form="editDialogForm"
      mode="edit"
      :submitting="editDialogSubmitting"
      @confirm="handleEditDialogConfirm"
    />

    <BoardUploadDialog
      v-model:visible="uploadDialogVisible"
      :submitting="uploadDialogSubmitting"
      @confirm="handleUploadConfirm"
    />
  </div>
</template>

<style scoped>
.board-detail-page {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
}
</style>
