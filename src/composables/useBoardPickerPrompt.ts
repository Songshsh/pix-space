import { getUserBoardsPage } from '../api/user-boards';
import type { Board } from '../types/user-boards';

export function useBoardPickerPrompt() {
  const boardPickerVisible = ref(false);
  const boardPickerLoading = ref(false);
  const boardPickerBoards = ref<Board[]>([]);
  const selectedBoardId = ref('');
  let resolver: ((value: string) => void) | null = null;

  const resetBoardPicker = () => {
    boardPickerVisible.value = false;
    boardPickerLoading.value = false;
    boardPickerBoards.value = [];
    selectedBoardId.value = '';
    resolver = null;
  };

  const promptBoardSelection = async (userId: number | string) => {
    if (boardPickerLoading.value || boardPickerVisible.value) {
      return '';
    }

    boardPickerLoading.value = true;
    try {
      const boards: Board[] = [];
      const MAX_BOARDS = 500;
      let page = 1;
      let hasMore = true;

      while (hasMore && boards.length < MAX_BOARDS) {
        const result = await getUserBoardsPage(
          userId,
          { page, pageSize: 100 },
          {
            silentError: true,
          }
        );
        boards.push(...result.list);
        hasMore = result.hasMore;
        page += 1;
      }

      if (!boards.length) {
        ElMessage.warning('请先创建画板');
        return '';
      }

      boardPickerBoards.value = boards;
      selectedBoardId.value = '';
      boardPickerVisible.value = true;
    } catch {
      ElMessage.error('加载画板失败，请稍后重试');
      return '';
    } finally {
      boardPickerLoading.value = false;
    }

    return await new Promise<string>((resolve) => {
      resolver = resolve;
      // 安全兜底：5 分钟后自动释放，防止 resolver 因异常未被正确清理导致内存泄漏
      setTimeout(
        () => {
          if (resolver === resolve) {
            resolver = null;
            if (boardPickerVisible.value) {
              boardPickerVisible.value = false;
              boardPickerBoards.value = [];
              selectedBoardId.value = '';
            }
            resolve('');
          }
        },
        5 * 60 * 1000
      );
    });
  };

  const handleBoardPickerConfirm = () => {
    if (!selectedBoardId.value) {
      return;
    }

    const nextBoardId = selectedBoardId.value;
    resolver?.(nextBoardId);
    resetBoardPicker();
  };

  const handleBoardPickerCancel = () => {
    resolver?.('');
    resetBoardPicker();
  };

  onBeforeUnmount(() => {
    if (resolver) {
      resolver('');
    }
  });

  onDeactivated(() => {
    // 清理 keep-alive 缓存场景下可能遗留的 resolver
    if (resolver) {
      resolver('');
    }
  });

  return {
    boardPickerVisible,
    boardPickerLoading,
    boardPickerBoards,
    selectedBoardId,
    promptBoardSelection,
    handleBoardPickerConfirm,
    handleBoardPickerCancel,
  };
}
