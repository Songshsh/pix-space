import type {
  CreateFolderPayload,
  FileItem,
  FileListParams,
} from '../types/file';
import { FileType } from '../utils/fileDisplay';
import { createTimestamp } from './shared';
interface FileRecord extends FileItem {
  parentId: number | null;
}

const seedFiles: FileRecord[] = [
  {
    id: 1,
    name: '项目文档',
    type: FileType.Folder,
    size: 0,
    modifiedAt: '2024-01-15',
    parentId: null,
  },
  {
    id: 2,
    name: '产品截图.png',
    type: FileType.Image,
    size: 2516582,
    modifiedAt: '2024-01-15',
    parentId: null,
  },
  {
    id: 3,
    name: '用户手册.pdf',
    type: FileType.Document,
    size: 1258291,
    modifiedAt: '2024-01-14',
    parentId: null,
  },
  {
    id: 4,
    name: '演示视频.mp4',
    type: FileType.Video,
    size: 47815065,
    modifiedAt: '2024-01-13',
    parentId: null,
  },
  {
    id: 5,
    name: '数据报表.xlsx',
    type: FileType.Spreadsheet,
    size: 331776,
    modifiedAt: '2024-01-12',
    parentId: null,
  },
  {
    id: 6,
    name: '设计稿',
    type: FileType.Folder,
    size: 0,
    modifiedAt: '2024-01-11',
    parentId: null,
  },
  {
    id: 7,
    name: '需求说明.md',
    type: FileType.Document,
    size: 18432,
    modifiedAt: '2024-01-11',
    parentId: 1,
  },
  {
    id: 8,
    name: '接口清单.xlsx',
    type: FileType.Spreadsheet,
    size: 409600,
    modifiedAt: '2024-01-10',
    parentId: 1,
  },
  {
    id: 9,
    name: '首页原型.fig',
    type: FileType.Document,
    size: 5242880,
    modifiedAt: '2024-01-09',
    parentId: 6,
  },
  {
    id: 10,
    name: '图标素材.zip',
    type: FileType.Document,
    size: 7340032,
    modifiedAt: '2024-01-08',
    parentId: 6,
  },
];

let filesState: FileRecord[] = seedFiles.map((file) => ({ ...file }));

function normalizeKeyword(value?: string) {
  return value?.trim().toLowerCase() || '';
}

function ensureValidParent(parentId: number | null) {
  if (parentId === null) return null;
  const parent = filesState.find((file) => file.id === parentId);
  if (!parent) {
    throw new Error('目标目录不存在');
  }
  if (parent.type !== FileType.Folder) {
    throw new Error('目标位置不是文件夹');
  }
  return parentId;
}

function resolveParentId(payload: CreateFolderPayload): number | null {
  if ('parentId' in payload) {
    return ensureValidParent(payload.parentId ?? null);
  }

  const path = 'parentPath' in payload ? payload.parentPath || [] : [];
  let currentParentId: number | null = null;
  for (const segment of path) {
    const folder = filesState.find(
      (file) =>
        file.type === FileType.Folder &&
        file.parentId === currentParentId &&
        file.name === segment
    );
    if (!folder) {
      throw new Error('目标目录不存在');
    }
    currentParentId = folder.id;
  }
  return ensureValidParent(currentParentId);
}

function ensureUniqueName(
  name: string,
  parentId: number | null,
  excludeId?: number
) {
  if (!name.trim()) {
    throw new Error('名称不合法');
  }
  const normalizedName = normalizeKeyword(name);
  const duplicated = filesState.some((file) => {
    if (excludeId !== undefined && file.id === excludeId) return false;
    return (
      file.parentId === parentId &&
      normalizeKeyword(file.name) === normalizedName
    );
  });
  if (duplicated) {
    throw new Error('当前目录下已存在同名文件或文件夹');
  }
}

function paginateFiles(list: FileItem[], params?: FileListParams) {
  const page = Math.max(1, Number(params?.page) || 1);
  const pageSize = Math.max(1, Number(params?.pageSize) || 20);
  const start = (page - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  };
}

function inferFileTypeByName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext))
    return FileType.Image;
  if (['mp4', 'mov', 'avi'].includes(ext)) return FileType.Video;
  if (['xlsx', 'xls', 'csv'].includes(ext)) return FileType.Spreadsheet;
  return FileType.Document;
}

function deleteRecursively(targetId: number) {
  const childFolders = filesState
    .filter(
      (file) => file.parentId === targetId && file.type === FileType.Folder
    )
    .map((file) => file.id);

  childFolders.forEach(deleteRecursively);
  filesState = filesState.filter(
    (file) => file.id !== targetId && file.parentId !== targetId
  );
}

export function getFilesMock(params?: FileListParams) {
  const parentId = params?.parentId ?? null;
  const keyword = normalizeKeyword(params?.keyword);
  const filtered = filesState
    .filter((file) => file.parentId === parentId)
    .filter((file) => {
      if (!keyword) return true;
      return normalizeKeyword(file.name).includes(keyword);
    })
    .sort((a, b) => {
      if (a.type === FileType.Folder && b.type !== FileType.Folder) return -1;
      if (a.type !== FileType.Folder && b.type === FileType.Folder) return 1;
      return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });

  return paginateFiles(filtered, params);
}

export function createFolderMock(payload: CreateFolderPayload) {
  const parentId = resolveParentId(payload);
  const name = payload.name.trim();
  ensureUniqueName(name, parentId);

  const nextFolder: FileRecord = {
    id: Date.now(),
    name,
    type: FileType.Folder,
    size: 0,
    modifiedAt: createTimestamp(),
    parentId,
  };

  filesState = [nextFolder, ...filesState];
  return nextFolder;
}

export function updateFileMock(id: number, name: string) {
  const targetIndex = filesState.findIndex((file) => file.id === id);
  if (targetIndex < 0) {
    throw new Error('文件不存在');
  }

  const current = filesState[targetIndex];
  const nextName = name.trim();
  ensureUniqueName(nextName, current.parentId, id);

  const updated: FileRecord = {
    ...current,
    name: nextName,
    modifiedAt: createTimestamp(),
  };

  filesState = filesState.map((file, index) =>
    index === targetIndex ? updated : file
  );

  return updated;
}

export function findFileByIdMock(id: number) {
  const file = filesState.find((item) => item.id === id);
  return file ? { ...file } : null;
}

export function deleteFileMock(id: number) {
  const target = filesState.find((file) => file.id === id);
  if (!target) {
    throw new Error('文件不存在');
  }

  if (target.type === FileType.Folder) {
    deleteRecursively(id);
    return true;
  }

  filesState = filesState.filter((file) => file.id !== id);
  return true;
}

export async function uploadFileMock(
  formData: FormData,
  parentId?: number | null
) {
  const nextParentId = ensureValidParent(parentId ?? null);
  const entries = formData.getAll('files');
  const selectedFiles = entries.filter(
    (entry): entry is File => entry instanceof File
  );

  if (!selectedFiles.length) {
    throw new Error('未选择有效文件');
  }
  const batchNames = new Set<string>();
  selectedFiles.forEach((file) => {
    const normalizedName = normalizeKeyword(file.name);
    if (!normalizedName) {
      throw new Error('名称不合法');
    }
    if (batchNames.has(normalizedName)) {
      throw new Error('本次上传包含同名文件');
    }
    batchNames.add(normalizedName);
    ensureUniqueName(file.name, nextParentId);
  });
  const createdFiles: FileRecord[] = selectedFiles.map((file, index) => {
    return {
      id: Date.now() + index,
      name: file.name,
      type: inferFileTypeByName(file.name),
      size: file.size,
      modifiedAt: createTimestamp(),
      parentId: nextParentId,
    };
  });

  filesState = [...createdFiles, ...filesState];
  return createdFiles[0];
}
