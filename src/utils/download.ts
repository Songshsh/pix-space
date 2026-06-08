import type { Image } from '../types/image';
import {
  downloadImage as downloadImageApi,
  downloadImageByUrl,
} from '../api/image';

export function sanitizeFilenamePart(input: string) {
  const cleaned = input
    .trim()
    .replace(/[\\/:*?"<>|\n\r\t]/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 60);
  return cleaned || 'untitled';
}

export function buildImageFilename(title: string, extension = 'png') {
  return `image-${sanitizeFilenamePart(title)}.${extension}`;
}

export function buildZipFilename() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `images-${date}-${time}.zip`;
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function parseContentDispositionFilename(
  contentDisposition: string | undefined
) {
  if (!contentDisposition) return '';
  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1].replace(/"/g, ''));
    } catch {
      void 0;
    }
  }

  const match = contentDisposition.match(/filename="([^"]+)"/i);
  const filename = match?.[1] || '';
  if (!filename.includes('%')) {
    return filename;
  }
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function getExtensionFromUrl(url: string | undefined) {
  if (!url) return '';
  const cleanUrl = url.split('?')[0]?.split('#')[0] || '';
  const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1]?.toLowerCase() || '';
}

function getExtensionFromMime(mime: string | undefined) {
  if (!mime) return '';
  const normalized = mime.toLowerCase();
  if (normalized.includes('jpeg')) return 'jpg';
  if (normalized.includes('png')) return 'png';
  if (normalized.includes('webp')) return 'webp';
  if (normalized.includes('gif')) return 'gif';
  if (normalized.includes('svg')) return 'svg';
  if (normalized.includes('bmp')) return 'bmp';
  if (normalized.includes('avif')) return 'avif';
  return '';
}

type DownloadableImage = Pick<Image, 'id' | 'title'> & {
  url?: string;
};

async function requestImageBlob(image: Pick<Image, 'id'> & { url?: string }) {
  if (image.url) {
    try {
      const response = await downloadImageByUrl(image.url, {
        notifyError: true,
        skipAuthRedirect: true,
      });
      return {
        blob: response.data as Blob,
        headers: response.headers,
      };
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401 || status === 403) {
        throw error;
      }
    }
  }

  const response = await downloadImageApi(image.id, { notifyError: true });
  return {
    blob: response.data as Blob,
    headers: response.headers,
  };
}

function resolveImageDownloadFilename(
  image: DownloadableImage,
  blob: Blob,
  headers: Record<string, unknown> | undefined
) {
  const fallbackExtension =
    getExtensionFromUrl(image.url) ||
    getExtensionFromMime(blob.type) ||
    getExtensionFromMime(
      typeof headers?.['content-type'] === 'string'
        ? headers['content-type']
        : undefined
    ) ||
    'png';
  const fallbackName = buildImageFilename(
    image.title || String(image.id),
    fallbackExtension
  );
  return (
    parseContentDispositionFilename(
      typeof headers?.['content-disposition'] === 'string'
        ? headers['content-disposition']
        : undefined
    ) || fallbackName
  );
}

export async function downloadImageFile(image: DownloadableImage) {
  const { blob, headers } = await requestImageBlob(image);
  const filename = resolveImageDownloadFilename(image, blob, headers);
  triggerDownload(blob, filename);
  return filename;
}

export async function fetchImagePayload(image: Image) {
  const { blob, headers } = await requestImageBlob(image);
  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    filename: resolveImageDownloadFilename(image, blob, headers),
    mime:
      (blob && typeof blob.type === 'string' && blob.type) ||
      (typeof headers?.['content-type'] === 'string'
        ? headers['content-type']
        : '') ||
      'image/png',
  };
}
