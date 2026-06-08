import type { Ref } from 'vue';
import type { Image } from '../../../types/image';
import {
  deleteImage as deleteImageApi,
  updateImage as updateImageApi,
} from '../../../api/image';
import { downloadImageFile } from '../../../utils/download';

interface UseImageActionsOptions {
  images: Ref<Image[]>;
  selectedImages: Ref<string[]>;
  toggleSelect: (image: Image) => void;
  loadImages: () => Promise<void>;
}

export function useImageActions(options: UseImageActionsOptions) {
  const { images, selectedImages, toggleSelect, loadImages } = options;

  const renameImage = (image: Image) => {
    ElMessageBox.prompt('请输入新的图片名称', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: image.title,
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return '图片名称不能为空';
        }
        return true;
      },
    })
      .then(async ({ value }) => {
        const newTitle = value.trim();
        try {
          await updateImageApi(image.id, { title: newTitle });
          const target = images.value.find((img: Image) => img.id === image.id);
          if (target) target.title = newTitle;
          loadImages();
          ElMessage.success('重命名成功');
        } catch {
          void 0;
        }
      })
      .catch(() => {});
  };

  const deleteImage = (image: Image) => {
    ElMessageBox.confirm(`确定要删除图片 "${image.title}" 吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteImageApi(image.id);
          images.value = images.value.filter(
            (img: Image) => img.id !== image.id
          );
          if (selectedImages.value.includes(image.id)) {
            toggleSelect(image);
          }
          loadImages();
          ElMessage.success('图片已删除');
        } catch {
          void 0;
        }
      })
      .catch(() => {});
  };

  const toggleFavorite = async (image: Image) => {
    const target = images.value.find((img: Image) => img.id === image.id);
    if (!target) return;
    const newValue = !target.isFavorite;
    try {
      await updateImageApi(image.id, { isFavorite: newValue });
      target.isFavorite = newValue;
      loadImages();
      ElMessage.success(newValue ? '已添加到收藏' : '已取消收藏');
    } catch {
      void 0;
    }
  };

  const changeTags = (image: Image) => {
    const inputValue = image.tags?.join(',') || '';
    ElMessageBox.prompt('请输入标签（逗号分隔）', '更换标签', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue,
    })
      .then(async ({ value }) => {
        const next = String(value || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        try {
          await updateImageApi(image.id, { tags: next });
          const target = images.value.find((img: Image) => img.id === image.id);
          if (target) target.tags = next;
          loadImages();
          ElMessage.success('标签已更新');
        } catch {
          void 0;
        }
      })
      .catch(() => {});
  };

  const downloadImage = async (image: Image) => {
    try {
      await downloadImageFile(image);
      ElMessage.success(`已开始下载《${image.title}》`);
    } catch {
      void 0;
    }
  };

  const copyImageLink = async (image: Image) => {
    try {
      await navigator.clipboard.writeText(image.url);
      ElMessage.success('链接已复制到剪贴板');
    } catch {
      ElMessage.error('复制失败');
    }
  };

  return {
    renameImage,
    deleteImage,
    toggleFavorite,
    changeTags,
    downloadImage,
    copyImageLink,
  };
}
