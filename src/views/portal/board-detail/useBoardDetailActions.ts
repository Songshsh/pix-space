import { updateBoard, uploadBoardImages } from '../../../api/boards';
import type { BoardDetail } from '../../../types/board-detail';
import type { BoardFormPayload } from '../../../types/user-boards';
import type { Ref } from 'vue';

interface UseBoardDetailActionsOptions {
  boardDetail: Ref<BoardDetail | null>;
  loadDetail: () => Promise<void>;
}

export function useBoardDetailActions(options: UseBoardDetailActionsOptions) {
  const { boardDetail, loadDetail } = options;

  const editDialogVisible = ref(false);
  const editDialogSubmitting = ref(false);
  const editDialogForm = ref<BoardFormPayload>({
    name: '',
    description: '',
    visibility: 'public',
  });

  const uploadDialogVisible = ref(false);
  const uploadDialogSubmitting = ref(false);

  const handleEditBoard = () => {
    if (!boardDetail.value) return;
    editDialogForm.value = {
      name: boardDetail.value.title,
      description: boardDetail.value.description,
      visibility: boardDetail.value.visibility,
    };
    editDialogVisible.value = true;
  };

  const handleEditDialogConfirm = async () => {
    if (!boardDetail.value || editDialogSubmitting.value) return;
    const name = editDialogForm.value.name.trim();
    if (!name) return;

    editDialogSubmitting.value = true;
    try {
      const updated = await updateBoard(boardDetail.value.id, {
        name,
        description: editDialogForm.value.description.trim(),
        visibility: editDialogForm.value.visibility,
      });

      boardDetail.value = {
        ...boardDetail.value,
        title: updated.title,
        description: updated.description,
        visibility: updated.visibility,
      };
      editDialogVisible.value = false;
      ElMessage.success('画板已更新');
    } catch (error) {
      const normalized = error as { status?: number };
      if (normalized.status === 403 || normalized.status === 404) {
        editDialogVisible.value = false;
        await loadDetail();
        return;
      }
      throw error;
    } finally {
      editDialogSubmitting.value = false;
    }
  };

  const handleUploadToBoard = () => {
    uploadDialogVisible.value = true;
  };

  const handleUploadConfirm = async (files: File[]) => {
    if (!boardDetail.value || uploadDialogSubmitting.value) return;
    if (!files.length) {
      ElMessage.warning('请选择图片');
      return;
    }

    uploadDialogSubmitting.value = true;
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const result = await uploadBoardImages(boardDetail.value.id, formData);
      boardDetail.value = result;
      uploadDialogVisible.value = false;
      ElMessage.success(`已上传 ${files.length} 张图片`);
    } catch (error) {
      const normalized = error as { status?: number };
      if (normalized.status === 403 || normalized.status === 404) {
        uploadDialogVisible.value = false;
        await loadDetail();
        return;
      }
      throw error;
    } finally {
      uploadDialogSubmitting.value = false;
    }
  };

  return {
    editDialogVisible,
    editDialogSubmitting,
    editDialogForm,
    uploadDialogVisible,
    uploadDialogSubmitting,
    handleEditBoard,
    handleEditDialogConfirm,
    handleUploadToBoard,
    handleUploadConfirm,
  };
}
