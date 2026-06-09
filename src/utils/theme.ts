export function parseRgbToHex(value: string): string | null {
  const match = value
    .replace(/\s+/g, '')
    .match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
  if (!match) return null;
  const r = Math.max(0, Math.min(255, Number(match[1])));
  const g = Math.max(0, Math.min(255, Number(match[2])));
  const b = Math.max(0, Math.min(255, Number(match[3])));
  // padStart(2, '0') 保证字符串长度为 2，不足就在前面补 0
  return (
    '#' +
    [r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toLowerCase()
  );
}

export const EP_DEFAULT_PRIMARY = '#409eff';
// Portal 固定主题预设只允许在统一主题初始化入口消费品牌色 token。
// 仅供 applyPortalPrimaryColorToRoot 使用，禁止业务代码直接消费。
const PORTAL_THEME_PRIMARY = 'var(--ds-color-brand-violet)';

export function resolveCssVar(value: string, el: HTMLElement): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^var\((--[^)]+)\)$/);
  if (!match) return trimmed;
  const styles = getComputedStyle(el);
  return styles.getPropertyValue(match[1]).trim();
}

export function normalizeToHex(value: string, el: HTMLElement): string | null {
  let normalized = resolveCssVar(value, el);
  normalized = resolveCssVar(normalized, el);
  if (normalized.startsWith('#')) return normalized;
  return parseRgbToHex(normalized);
}

export function applyPrimaryColorToElement(
  value: string,
  el: HTMLElement
): string | null {
  const hexColor = normalizeToHex(value, el);
  if (!hexColor) return null;

  el.style.setProperty('--el-color-primary', hexColor);

  const hasColorMix =
    typeof CSS !== 'undefined' &&
    CSS.supports('color', 'color-mix(in srgb, black 50%, white)');
  if (hasColorMix) {
    for (let i = 1; i <= 9; i++) {
      const ratio = 100 - i * 10;
      el.style.setProperty(
        `--el-color-primary-light-${i}`,
        `color-mix(in srgb, var(--el-color-primary) ${ratio}%, white)`
      );
    }
    el.style.setProperty(
      '--el-color-primary-dark-2',
      'color-mix(in srgb, var(--el-color-primary) 80%, black)'
    );
    return hexColor;
  }

  const color = hexColor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  for (let i = 1; i <= 9; i++) {
    const mixRatio = i * 0.1;
    const mixR = Math.round(255 * mixRatio + r * (1 - mixRatio));
    const mixG = Math.round(255 * mixRatio + g * (1 - mixRatio));
    const mixB = Math.round(255 * mixRatio + b * (1 - mixRatio));
    el.style.setProperty(
      `--el-color-primary-light-${i}`,
      `rgb(${mixR}, ${mixG}, ${mixB})`
    );
  }

  const darkRatio = 0.2;
  const darkR = Math.round(r * (1 - darkRatio));
  const darkG = Math.round(g * (1 - darkRatio));
  const darkB = Math.round(b * (1 - darkRatio));
  el.style.setProperty(
    '--el-color-primary-dark-2',
    `rgb(${darkR}, ${darkG}, ${darkB})`
  );

  return hexColor;
}

export function applyAdminPrimaryColorToRoot(
  adminPrimaryColor = ''
): string | null {
  if (typeof document === 'undefined') return null;
  return applyPrimaryColorToElement(
    adminPrimaryColor || EP_DEFAULT_PRIMARY,
    document.documentElement
  );
}

export function applyPortalPrimaryColorToRoot(): string | null {
  if (typeof document === 'undefined') return null;
  return applyPrimaryColorToElement(
    PORTAL_THEME_PRIMARY,
    document.documentElement
  );
}

export function isAdminRoutePath(path: string): boolean {
  return path === '/admin' || path.startsWith('/admin/');
}
