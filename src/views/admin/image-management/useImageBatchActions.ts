import type { Ref } from 'vue';
import type { Image } from '../../../types/image';
import {
  deleteImage as deleteImageApi,
  updateImage as updateImageApi,
} from '../../../api/image';
import { zip } from 'fflate';
import {
  buildZipFilename,
  fetchImagePayload,
  triggerDownload,
} from '../../../utils/download';

interface UseImageBatchActionsOptions {
  images: Ref<Image[]>;
  selectedImages: Ref<string[]>;
  clearSelection: () => void;
  loadImages: () => Promise<void>;
}

function summarizeSettledResults<T>(
  ids: string[],
  results: PromiseSettledResult<T>[]
) {
  const failedIds: string[] = [];
  let successCount = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successCount += 1;
      return;
    }
    failedIds.push(ids[index]);
  });

  return {
    successCount,
    failedCount: failedIds.length,
    failedIds,
  };
}

function zipAsync(
  entries: Record<string, Uint8Array>,
  options: { level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    zip(entries, options, (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(data);
    });
  });
}

export function useImageBatchActions(options: UseImageBatchActionsOptions) {
  const { images, selectedImages, clearSelection, loadImages } = options;

  const handleBatchDelete = () => {
    if (selectedImages.value.length === 0) return;

    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedImages.value.length} 张图片吗？此操作不可恢复。`,
      '批量删除警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
      .then(async () => {
        const targetIds = [...selectedImages.value];
        try {
          const results = await Promise.allSettled(
            targetIds.map((id) => deleteImageApi(id))
          );
          const { successCount, failedCount, failedIds } =
            summarizeSettledResults(targetIds, results);
          selectedImages.value = failedIds;
          await loadImages();
          if (failedCount === 0) {
            ElMessage.success('批量删除成功');
            clearSelection();
            return;
          }
          if (successCount > 0) {
            ElMessage.warning(
              `已删除 ${successCount} 张图片，${failedCount} 张失败`
            );
            return;
          }
          ElMessage.error('批量删除失败');
        } catch {
          await loadImages();
        }
      })
      .catch(() => {});
  };

  const handleBatchFavorite = async () => {
    if (selectedImages.value.length === 0) return;
    try {
      const targetIds = [...selectedImages.value];
      const results = await Promise.allSettled(
        targetIds.map((id) => updateImageApi(id, { isFavorite: true }))
      );
      const { successCount, failedCount, failedIds } = summarizeSettledResults(
        targetIds,
        results
      );
      selectedImages.value = failedIds;
      await loadImages();
      if (failedCount === 0) {
        ElMessage.success(`已将 ${successCount} 张图片加入收藏`);
        clearSelection();
        return;
      }
      if (successCount > 0) {
        ElMessage.warning(
          `已收藏 ${successCount} 张图片，${failedCount} 张失败`
        );
        return;
      }
      ElMessage.error('批量收藏失败');
    } catch {
      void 0;
    }
  };

  const handleBatchChangeTags = () => {
    if (selectedImages.value.length === 0) return;
    ElMessageBox.prompt('请输入标签（逗号分隔）', '批量更换标签', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(async ({ value }) => {
        const next = String(value || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        try {
          const targetIds = [...selectedImages.value];
          const results = await Promise.allSettled(
            targetIds.map((id) => updateImageApi(id, { tags: next }))
          );
          const { successCount, failedCount, failedIds } =
            summarizeSettledResults(targetIds, results);
          selectedImages.value = failedIds;
          await loadImages();
          if (failedCount === 0) {
            ElMessage.success('标签已更新');
            clearSelection();
            return;
          }
          if (successCount > 0) {
            ElMessage.warning(
              `已更新 ${successCount} 张图片的标签，${failedCount} 张失败`
            );
            return;
          }
          ElMessage.error('批量更新标签失败');
        } catch {
          void 0;
        }
      })
      .catch(() => {});
  };

  const handleBatchDownload = async () => {
    if (selectedImages.value.length === 0) return;
    const targets = images.value.filter((img: Image) =>
      selectedImages.value.includes(img.id)
    );
    if (targets.length === 0) return;

    const loadingMessage = ElMessage({
      message: '正在打包下载...',
      type: 'info',
      duration: 0,
    });
    try {
      const results = await Promise.allSettled(
        targets.map((image) => fetchImagePayload(image))
      );
      const failedIds = targets
        .filter((_, index) => results[index]?.status === 'rejected')
        .map((image) => image.id);

      const used = new Map<string, number>();
      const ensureUnique = (filename: string) => {
        const match = filename.match(/^(.*?)(\.[^.]+)?$/);
        const base = match?.[1] || filename;
        const extension = match?.[2] || '';
        const key = `${base}${extension}`;
        const count = used.get(key) || 0;
        used.set(key, count + 1);
        return count === 0 ? key : `${base}-${count + 1}${extension}`;
      };

      const entries: Record<string, Uint8Array> = {};
      results.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        entries[ensureUnique(result.value.filename)] = result.value.bytes;
      });

      const filenames = Object.keys(entries);
      if (filenames.length === 0) {
        ElMessage.error('批量下载失败');
        selectedImages.value = failedIds;
        return;
      }

      const zipped = await zipAsync(entries, { level: 0 });
      const blobPart =
        zipped.buffer instanceof ArrayBuffer
          ? zipped.buffer.slice(
              zipped.byteOffset,
              zipped.byteOffset + zipped.byteLength
            )
          : zipped;
      triggerDownload(
        new Blob([blobPart as BlobPart], { type: 'application/zip' }),
        buildZipFilename()
      );
      selectedImages.value = failedIds;
      if (failedIds.length === 0) {
        ElMessage.success(`已打包下载 ${filenames.length} 张图片`);
        clearSelection();
        return;
      }
      ElMessage.warning(
        `已打包 ${filenames.length} 张图片，${failedIds.length} 张下载失败`
      );
    } catch {
      ElMessage.error('批量下载失败');
    } finally {
      loadingMessage.close();
    }
  };

  return {
    handleBatchDelete,
    handleBatchFavorite,
    handleBatchChangeTags,
    handleBatchDownload,
  };
}
