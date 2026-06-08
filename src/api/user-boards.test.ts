import { describe, expect, it } from 'vitest';
import {
  getUserBoardsPage,
  getUserBoardsSummary,
  getUserLikesPage,
  getUserUploadsPage,
} from './user-boards';

describe('user boards api', () => {
  it('exposes paginated user boards apis', () => {
    expect(typeof getUserBoardsSummary).toBe('function');
    expect(typeof getUserBoardsPage).toBe('function');
    expect(typeof getUserUploadsPage).toBe('function');
    expect(typeof getUserLikesPage).toBe('function');
  });
});
