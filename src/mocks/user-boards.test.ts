import { describe, expect, it } from 'vitest';
import { getUserBoardsSummaryMock, resetUserBoardsMock } from './user-boards';

describe('user boards mock', () => {
  it('returns summary by userId with stable profile id', () => {
    resetUserBoardsMock();

    const summary = getUserBoardsSummaryMock(101);

    expect(summary.profile.id).toBe(101);
    expect(typeof summary.profile.username).toBe('string');
    expect(summary.stats.likes).toBeGreaterThanOrEqual(0);
  });
});
