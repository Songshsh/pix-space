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
      let page = 1;
      let hasMore = true;

      while (hasMore) {
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
