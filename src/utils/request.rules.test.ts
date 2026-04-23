import { describe, expect, it } from 'vitest';
import { shouldNotifyError } from './request';
import type { NormalizedRequestError } from '../types/http';
import type { InternalAxiosRequestConfig } from 'axios';

describe('shouldNotifyError', () => {
  it('does not notify on GET by default', () => {
    expect(
      shouldNotifyError(
        { method: 'get' } as InternalAxiosRequestConfig,
        { isCanceled: false } as NormalizedRequestError
      )
    ).toBe(false);
  });

  it('notifies on non-GET by default', () => {
    expect(
      shouldNotifyError(
        { method: 'post' } as InternalAxiosRequestConfig,
        { isCanceled: false } as NormalizedRequestError
      )
    ).toBe(true);
  });

  it('notifies on GET when notifyError is true', () => {
    expect(
      shouldNotifyError(
        { method: 'get', notifyError: true } as InternalAxiosRequestConfig & {
          notifyError?: boolean;
        },
        {
          isCanceled: false,
        } as NormalizedRequestError
      )
    ).toBe(true);
  });

  it('does not notify when silentError is true', () => {
    expect(
      shouldNotifyError(
        { method: 'post', silentError: true } as InternalAxiosRequestConfig & {
          silentError?: boolean;
        },
        {
          isCanceled: false,
        } as NormalizedRequestError
      )
    ).toBe(false);
  });
});
