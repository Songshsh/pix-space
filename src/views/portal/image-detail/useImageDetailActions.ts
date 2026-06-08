import {
  collectImageToBoard,
  likeImage,
  unlikeImage,
} from '../../../api/user-boards';
import { useBoardPickerPrompt } from '../../../composables/useBoardPickerPrompt';
import { useUserStore } from '../../../stores/user';
import { downloadImageFile } from '../../../utils/download';
import type { ImageDetail } from '../../../types/image-detail';
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import type { Ref } from 'vue';

interface UseImageDetailActionsOptions {
  imageDetail: Ref<ImageDetail | null>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  userStore: ReturnType<typeof useUserStore>;
}

export function useImageDetailActions(options: UseImageDetailActionsOptions) {
  const { imageDetail, route, router, userStore } = options;

  const collecting = ref(false);
  const downloading = ref(false);
  const liking = ref(false);
  const actingUserId = computed(() => userStore.id || 0);

  const {
    boardPickerVisible,
    boardPickerLoading,
    boardPickerBoards,
    selectedBoardId,
    promptBoardSelection,
    handleBoardPickerConfirm,
    handleBoardPickerCancel,
  } = useBoardPickerPrompt();

  const ensureLoggedInUser = () => {
    if (!userStore.isAuthenticated) {
      ElMessage.warning('请先登录');
      router.push({
        path: '/login',
        query: { redirect: route.fullPath },
      });
      return '';
    }
    if (!actingUserId.value) {
      ElMessage.warning('用户信息不完整');
      return 0;
    }
    return actingUserId.value;
  };

  const handleCollect = async () => {
    if (
      !imageDetail.value ||
      collecting.value ||
      boardPickerLoading.value ||
      boardPickerVisible.value
    ) {
      return false;
    }

    const username = ensureLoggedInUser();
    if (!username) return false;

    try {
      const boardId = await promptBoardSelection(username);
      if (!boardId || !imageDetail.value) return false;

      collecting.value = true;

      await collectImageToBoard(username, boardId, {
        imageId: imageDetail.value.id,
        source: imageDetail.value.source,
      });

      ElMessage.success('已采集到画板');
      return true;
    } catch (error) {
      if (error === 'cancel' || error === 'close') return false;
      return false;
    } finally {
      collecting.value = false;
    }
  };

  const handleDownload = async () => {
    if (!imageDetail.value || downloading.value) return;
    downloading.value = true;

    try {
      await downloadImageFile({
        id: imageDetail.value.id,
        title: imageDetail.value.title,
        url: imageDetail.value.url,
      });
      ElMessage.success(`已开始下载《${imageDetail.value.title}》`);
    } catch {
      ElMessage.error('下载失败，请稍后重试');
    } finally {
      downloading.value = false;
    }
  };

  const handleLike = async () => {
    if (!imageDetail.value || liking.value) return;
    const username = ensureLoggedInUser();
    if (!username) return;
    liking.value = true;

    try {
      if (imageDetail.value.isLiked) {
        await unlikeImage(username, imageDetail.value.id);
        imageDetail.value = { ...imageDetail.value, isLiked: false };
        ElMessage.success('已取消赞');
      } else {
        await likeImage(username, imageDetail.value.id);
        imageDetail.value = { ...imageDetail.value, isLiked: true };
        ElMessage.success('已点赞');
      }
    } finally {
      liking.value = false;
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      ElMessage.success('链接已复制');
      return;
    } catch (error) {
      void error;
    }

    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (copied) {
      ElMessage.success('链接已复制');
      return;
    }

    ElMessage.error('复制失败，请手动复制当前链接');
  };

  return {
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
  };
}
