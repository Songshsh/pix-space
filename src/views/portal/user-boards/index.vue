<script setup lang="ts">
import BoardSelectDialog from '../../../components/common/BoardSelectDialog.vue';
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import BoardFormDialog from '../../../components/portal/BoardFormDialog.vue';
import UserBoardsBoardsTab from './UserBoardsBoardsTab.vue';
import UserBoardsLikesTab from './UserBoardsLikesTab.vue';
import UserBoardsTabs from './UserBoardsTabs.vue';
import UserBoardsUploadsTab from './UserBoardsUploadsTab.vue';
import UserProfileCard from './UserProfileCard.vue';
import { useUserBoardsActions } from './useUserBoardsActions';
import { useUserBoardsView } from './useUserBoardsView';

const {
  activeTab,
  userId,
  isOwnerView,
  profile,
  stats,
  uploadsSearch,
  likesSearch,
  uploadsSort,
  summaryLoading,
  summaryError,
  boardsState,
  uploadsState,
  likesState,
  viewState,
  activeCountText,
  stateTitle,
  stateDesc,
  stateIcon,
  showStatePrimaryAction,
  statePrimaryActionText,
  loadOverview,
  handleUploadsSortCommand,
  handleStatePrimaryAction,
  goBoard,
  goImageDetail,
  loadMoreBoards,
  loadMoreUploads,
  loadMoreLikes,
  getUploadStatusText,
  getBoardVisibilityText,
} = useUserBoardsView();

const {
  boardPickerVisible,
  boardPickerLoading,
  boardPickerBoards,
  selectedBoardId,
  handleBoardPickerConfirm,
  handleBoardPickerCancel,
  dialogVisible,
  dialogMode,
  dialogSubmitting,
  dialogForm,
  handleCreateBoard,
  handleDialogConfirm,
  handleBoardCommand,
  handleUploadCommand,
  handleLikeCommand,
} = useUserBoardsActions(userId, loadOverview);

const onStatePrimaryAction = () => {
  handleStatePrimaryAction(handleCreateBoard);
};
</script>

<template>
  <div class="user-boards-page">
    <UserProfileCard
      :username="profile.username"
      :profile-name="profile.username"
      :bio="profile.bio"
      :stats="stats"
      :loading="summaryLoading"
    />

    <div class="content-section">
      <UserBoardsTabs
        :active-tab="activeTab"
        :is-owner-view="isOwnerView"
        :show-create-button="isOwnerView && activeTab === 'boards'"
        :show-likes-tab="isOwnerView"
        @update:active-tab="(value) => (activeTab = value)"
        @create-board="handleCreateBoard"
      />

      <UserBoardsBoardsTab
        v-if="
          activeTab === 'boards' &&
          viewState !== 'error' &&
          viewState !== 'empty'
        "
        :items="boardsState.items"
        :loading="boardsState.loading"
        :loading-more="boardsState.loadingMore"
        :load-more-error="boardsState.error"
        :has-more="boardsState.hasMore"
        :show-actions="isOwnerView"
        :get-board-visibility-text="getBoardVisibilityText"
        @open-board="goBoard"
        @board-command="handleBoardCommand"
        @load-more="loadMoreBoards"
        @retry-load-more="loadMoreBoards"
      />

      <UserBoardsUploadsTab
        v-else-if="
          activeTab === 'uploads' &&
          viewState !== 'error' &&
          viewState !== 'empty'
        "
        :items="uploadsState.items"
        :search="uploadsSearch"
        :sort="uploadsSort"
        :count-text="activeCountText"
        :loading="uploadsState.loading"
        :loading-more="uploadsState.loadingMore"
        :load-more-error="uploadsState.error"
        :has-more="uploadsState.hasMore"
        :show-actions="isOwnerView"
        :get-upload-status-text="getUploadStatusText"
        @update:search="(value) => (uploadsSearch = value)"
        @sort-command="handleUploadsSortCommand"
        @open-image="goImageDetail"
        @upload-command="handleUploadCommand"
        @load-more="loadMoreUploads"
        @retry-load-more="loadMoreUploads"
      />

      <UserBoardsLikesTab
        v-else-if="
          activeTab === 'likes' &&
          viewState !== 'error' &&
          viewState !== 'empty'
        "
        :items="likesState.items"
        :search="likesSearch"
        :count-text="activeCountText"
        :loading="likesState.loading"
        :loading-more="likesState.loadingMore"
        :load-more-error="likesState.error"
        :has-more="likesState.hasMore"
        :show-actions="isOwnerView"
        @update:search="(value) => (likesSearch = value)"
        @open-image="goImageDetail"
        @like-command="handleLikeCommand"
        @load-more="loadMoreLikes"
        @retry-load-more="loadMoreLikes"
      />

      <PageStateBlock
        v-else
        :variant="
          viewState === 'notfound'
            ? 'notfound'
            : summaryError || viewState === 'error'
              ? 'error'
              : 'empty'
        "
        :icon="stateIcon"
        :title="summaryError || viewState === 'error' ? '加载失败' : stateTitle"
        :description="
          summaryError || viewState === 'error'
            ? '网络或服务异常，请稍后重试'
            : stateDesc
        "
        :primary-text="showStatePrimaryAction ? statePrimaryActionText : ''"
        @primary="onStatePrimaryAction"
      />
    </div>

    <BoardFormDialog
      v-if="isOwnerView"
      v-model:visible="dialogVisible"
      v-model:form="dialogForm"
      :mode="dialogMode"
      :submitting="dialogSubmitting"
      @confirm="handleDialogConfirm"
    />

    <BoardSelectDialog
      v-if="isOwnerView"
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
.user-boards-page {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}

.content-section {
  display: flex;
  flex-direction: column;
}
</style>
