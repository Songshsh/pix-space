import type { Image } from '../types/image';

export interface ImageListMockParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sortBy?: string;
  collection?: string;
  tag?: string;
}

const tagPool = ['自然', '城市', '人物', '动物', '建筑'];

const sampleUrls = Array.from({ length: 20 }, (_, index) => {
  const value = String(index + 1).padStart(2, '0');
  return `/mock-images/sample-${value}.png`;
});

const seedImages: Image[] = sampleUrls.map((url, index) => {
  const day = String(((index + 10) % 28) + 1).padStart(2, '0');
  const hour = String((index * 3) % 24).padStart(2, '0');
  const minute = String((index * 7) % 60).padStart(2, '0');
  const id = `g${String(index + 1).padStart(2, '0')}`;
  const tagA = tagPool[index % tagPool.length];
  const tagB = tagPool[(index + 2) % tagPool.length];
  return {
    id,
    title: `图片样张 ${String(index + 1).padStart(2, '0')}`,
    url,
    size: 800_000 + index * 45_000,
    createdAt: `2026-05-${day} ${hour}:${minute}`,
    tags: index % 3 === 0 ? [tagA] : [tagA, tagB],
    isFavorite: index % 5 === 0,
  };
});

let imagesState: Image[] = seedImages.map((item) => ({ ...item }));

function cloneSeed() {
  imagesState = seedImages.map((item) => ({
    ...item,
    tags: [...(item.tags || [])],
  }));
}

export function getImagesMock(): Image[] {
  return imagesState.map((item) => ({ ...item, tags: [...(item.tags || [])] }));
}

export function getImageListMock(params: ImageListMockParams = {}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize =
    params.pageSize && params.pageSize > 0 ? params.pageSize : 12;
  const keyword = (params.query || '').trim().toLowerCase();
  const tag = (params.tag || '').trim();
  const collection = params.collection || 'all';
  const sortBy = params.sortBy || 'newest';

  let list = getImagesMock();

  if (collection === 'favorites') {
    list = list.filter((item) => item.isFavorite === true);
  }

  if (collection === 'recent') {
    const now = Date.now();
    const cutoff = now - 7 * 24 * 60 * 60 * 1000;
    list = list.filter((item) => {
      const value = Date.parse(String(item.createdAt || '').replace(' ', 'T'));
      return Number.isFinite(value) ? value >= cutoff : true;
    });
  }

  if (tag) {
    list = list.filter((item) => item.tags?.includes(tag));
  }

  if (keyword) {
    list = list.filter((item) => {
      const title = item.title?.toLowerCase() || '';
      const tags = item.tags?.join(' ').toLowerCase() || '';
      return title.includes(keyword) || tags.includes(keyword);
    });
  }

  list = [...list].sort((a, b) => {
    if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
    return b.createdAt.localeCompare(a.createdAt);
  });

  const total = list.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: list.slice(start, end),
    total,
  };
}

export function updateImageMock(
  id: string | number,
  data: { title?: string; isFavorite?: boolean; tags?: string[] }
): Image {
  const targetIndex = imagesState.findIndex((img) => img.id === String(id));
  if (targetIndex < 0) {
    throw new Error('图片不存在');
  }

  const current = imagesState[targetIndex];
  const updated: Image = {
    ...current,
    title: data.title !== undefined ? data.title : current.title,
    isFavorite:
      data.isFavorite !== undefined
        ? data.isFavorite
        : Boolean(current.isFavorite),
    tags:
      data.tags !== undefined
        ? [...data.tags]
        : current.tags
          ? [...current.tags]
          : [],
  };
  imagesState = imagesState.map((img, index) =>
    index === targetIndex ? updated : img
  );
  return { ...updated, tags: [...(updated.tags || [])] };
}

export function deleteImageMock(id: string | number) {
  const exists = imagesState.some((img) => img.id === String(id));
  if (!exists) throw new Error('图片不存在');
  imagesState = imagesState.filter((img) => img.id !== String(id));
  return true;
}

export async function uploadImagesMock(formData: FormData) {
  const files = formData
    .getAll('files')
    .filter((item): item is File => item instanceof File);
  if (files.length === 0) {
    throw new Error('未选择文件');
  }
  const date = new Date().toISOString().slice(0, 10);
  const baseCount = imagesState.length;

  const created = files.map((file, index) => {
    const id = `g${Date.now()}${index}`;
    const title =
      file.name.replace(/\.[^/.]+$/, '') || `新图片 ${baseCount + index + 1}`;
    const url = sampleUrls[(baseCount + index) % sampleUrls.length];
    const tag = tagPool[(baseCount + index) % tagPool.length];
    return {
      id,
      title,
      url,
      size: file.size || 900_000,
      createdAt: `${date} 10:00`,
      tags: [tag],
      isFavorite: false,
    } satisfies Image;
  });

  imagesState = [...created, ...imagesState];
  return created.map((item) => ({ ...item, tags: [...(item.tags || [])] }));
}

export function resetImagesMock() {
  cloneSeed();
}
