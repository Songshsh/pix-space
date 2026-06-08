import {
  collectImageToBoard,
  createUserBoard,
  deleteUploadedImage,
  unlikeImage,
  updateUploadedImageStatus,
} from '../../../api/user-boards';
import { deleteBoard, updateBoard } from '../../../api/boards';
import { downloadImageFile } from '../../../utils/download';
import type {
  Board,
  BoardFormPayload,
  LikedImage,
  UploadImage,
} from '../../../types/user-boards';
import { useBoardPickerPrompt } from '../../../composables/useBoardPickerPrompt';

export function useUserBoardsActions(
  userId: Ref<number>,
  loadOverview: () => Promise<void>
) {
  const getActionErrorMessage = (error: unknown, fallback: string) => {
    if (error === 'cancel') return '';
    return error instanceof Error && error.message ? error.message : fallback;
  };

  const {
    promptBoardSelection,
    boardPickerVisible,
    boardPickerLoading,
    boardPickerBoards,
    selectedBoardId,
    handleBoardPickerConfirm,
    handleBoardPickerCancel,
  } = useBoardPickerPrompt();

  const dialogVisible = ref(false);
  const dialogMode = ref<'create' | 'edit'>('create');
  const editingBoardId = ref('');
  const dialogSubmitting = ref(false);
  const dialogForm = ref<BoardFormPayload>({
    name: '',
    description: '',
    visibility: 'public',
  });

  const handleCreateBoard = () => {
    dialogMode.value = 'create';
    editingBoardId.value = '';
    dialogForm.value = { name: '', description: '', visibility: 'public' };
    dialogVisible.value = true;
  };

  const handleEditBoard = (board: Board) => {
    dialogMode.value = 'edit';
    dialogForm.value = {
      name: board.title,
      description: board.description,
      visibility: board.visibility,
    };
    editingBoardId.value = board.id;
    dialogVisible.value = true;
  };

  const handleDialogConfirm = async () => {
    const name = dialogForm.value.name.trim();
    if (!name) return;
    dialogSubmitting.value = true;
    try {
      const payload = {
        ...dialogForm.value,
        name,
        description: dialogForm.value.description.trim(),
      };
      if (dialogMode.value === 'create') {
        await createUserBoard(userId.value, payload);
        ElMessage.success('画板创建成功');
      } else {
        await updateBoard(editingBoardId.value, payload);
        ElMessage.success('画板更新成功');
      }
      dialogVisible.value = false;
      await loadOverview();
    } catch (error) {
      const message = getActionErrorMessage(
        error,
        dialogMode.value === 'create'
          ? '创建画板失败，请稍后重试'
          : '更新画板失败，请稍后重试'
      );
      if (message) {
        ElMessage.error(message);
      }
    } finally {
      dialogSubmitting.value = false;
    }
  };

  const downloadCardImage = async (img: {
    id?: string;
    title: string;
    url?: string;
  }) => {
    try {
      await downloadImageFile({
        id: img.id || img.title,
        title: img.title,
        url: img.url,
      });
      ElMessage.success(`已开始下载《${img.title}》`);
    } catch {
      ElMessage.error('下载失败，请稍后重试');
    }
  };

  const handleUploadCommand = async (command: string, img: UploadImage) => {
    if (command === 'download') {
      await downloadCardImage(img);
      return;
    }

    if (command === 'collect') {
      try {
        const boardId = await promptBoardSelection(userId.value);
        if (!boardId) return;
        await collectImageToBoard(userId.value, boardId, {
          imageId: img.id,
          source: 'upload',
        });
        ElMessage.success('已采集到画板');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(error, '采集失败，请稍后重试');
        if (message) {
          ElMessage.error(message);
        }
      }
      return;
    }

    if (command === 'apply') {
      if (img.status !== 'private') {
        ElMessage.info('当前图片无需重复申请公开');
        return;
      }
      try {
        await updateUploadedImageStatus(userId.value, img.id, {
          status: 'pending',
        });
        ElMessage.success('已提交公开申请');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(
          error,
          '公开申请失败，请稍后重试'
        );
        if (message) {
          ElMessage.error(message);
        }
      }
      return;
    }

    if (command === 'delete') {
      try {
        await ElMessageBox.confirm(`确定删除《${img.title}》吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await deleteUploadedImage(userId.value, img.id);
        ElMessage.success('图片已删除');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(error, '删除失败，请稍后重试');
        if (message) {
          ElMessage.error(message);
        }
      }
    }
  };

  const handleLikeCommand = async (command: string, img: LikedImage) => {
    if (command === 'download') {
      await downloadCardImage(img);
      return;
    }

    if (command === 'collect') {
      try {
        const boardId = await promptBoardSelection(userId.value);
        if (!boardId) return;
        await collectImageToBoard(userId.value, boardId, {
          imageId: img.id,
          source: 'like',
        });
        ElMessage.success('已采集到画板');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(error, '采集失败，请稍后重试');
        if (message) {
          ElMessage.error(message);
        }
      }
      return;
    }

    if (command === 'unlike') {
      try {
        await unlikeImage(userId.value, img.id);
        ElMessage.success('已取消赞');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(
          error,
          '取消点赞失败，请稍后重试'
        );
        if (message) {
          ElMessage.error(message);
        }
      }
    }
  };

  const handleBoardCommand = async (command: string, board: Board) => {
    if (command === 'edit') {
      handleEditBoard(board);
      return;
    }

    if (command === 'delete') {
      try {
        await ElMessageBox.confirm(
          `确定删除画板「${board.title}」吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        await deleteBoard(board.id);
        ElMessage.success('画板已删除');
        await loadOverview();
      } catch (error) {
        const message = getActionErrorMessage(error, '删除失败，请稍后重试');
        if (message) {
          ElMessage.error(message);
        }
      }
    }
  };

  return {
    boardPickerVisible,
    boardPickerLoading,
    boardPickerBoards,
    selectedBoardId,
    handleBoardPickerConfirm,
    handleBoardPickerCancel,
    dialogVisible,
    dialogMode,
    editingBoardId,
    dialogSubmitting,
    dialogForm,
    handleCreateBoard,
    handleDialogConfirm,
    handleBoardCommand,
    handleUploadCommand,
    handleLikeCommand,
  };
}
