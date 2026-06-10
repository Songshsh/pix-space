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

  const ensureLoggedInUser = (): number | null => {
    if (!userStore.isAuthenticated) {
      ElMessage.warning('请先登录');
      router.push({
        path: '/login',
        query: { redirect: route.fullPath },
      });
      return null;
    }
    if (!actingUserId.value) {
      ElMessage.warning('用户信息不完整');
      return null;
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

    const uid = ensureLoggedInUser();
    if (uid === null) return false;

    try {
      const boardId = await promptBoardSelection(uid);
      if (!boardId || !imageDetail.value) return false;

      collecting.value = true;

      await collectImageToBoard(uid, boardId, {
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
    const uid = ensureLoggedInUser();
    if (uid === null) return;
    liking.value = true;

    try {
      if (imageDetail.value.isLiked) {
        await unlikeImage(uid, imageDetail.value.id);
        imageDetail.value = { ...imageDetail.value, isLiked: false };
        ElMessage.success('已取消赞');
      } else {
        await likeImage(uid, imageDetail.value.id);
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
    // 降级路径：navigator.clipboard.writeText 失败时（通常是安全上下文限制或用户拒绝权限）。
    // document.execCommand('copy') 已被 Web 标准废弃，但作为降级手段仍广泛可用，暂保留以提升兼容性。
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
