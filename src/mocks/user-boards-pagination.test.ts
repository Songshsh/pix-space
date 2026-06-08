import { describe, expect, it } from 'vitest';
import {
  getUserBoardsLikesPageMock,
  getUserBoardsPageMock,
  getUserBoardsSummaryMock,
  getUserUploadsPageMock,
  resetUserBoardsMock,
} from './user-boards';

describe('user boards pagination mock', () => {
  it('returns summary by userId', () => {
    resetUserBoardsMock();
    const summary = getUserBoardsSummaryMock(101);

    expect(summary.profile.id).toBe(101);
    expect(summary.stats.likes).toBeGreaterThanOrEqual(0);
  });

  it('returns boards page with hasMore', () => {
    resetUserBoardsMock();
    const result = getUserBoardsPageMock(101, { page: 1, pageSize: 2 });

    expect(result.list).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(true);
  });

  it('filters uploads by keyword and sort', () => {
    resetUserBoardsMock();
    const result = getUserUploadsPageMock(101, {
      page: 1,
      pageSize: 20,
      keyword: '排版',
      sort: 'oldest',
    });

    expect(result.list.every((item) => item.title.includes('排版'))).toBe(true);
  });

  it('supports at least two more upload pages', () => {
    resetUserBoardsMock();
    const result = getUserUploadsPageMock(101, {
      page: 2,
      pageSize: 20,
      sort: 'newest',
    });

    expect(result.list).toHaveLength(20);
    expect(result.hasMore).toBe(true);
  });

  it('filters likes by keyword', () => {
    resetUserBoardsMock();
    const result = getUserBoardsLikesPageMock(101, {
      page: 1,
      pageSize: 20,
      keyword: '字体',
    });

    expect(result.list.every((item) => item.title.includes('字体'))).toBe(true);
  });

  it('supports at least two more like pages', () => {
    resetUserBoardsMock();
    const result = getUserBoardsLikesPageMock(101, {
      page: 2,
      pageSize: 20,
    });

    expect(result.list).toHaveLength(20);
    expect(result.hasMore).toBe(true);
  });
});
