import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from './user';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('useUserStore', () => {
  it('login writes user and token', () => {
    const store = useUserStore();

    store.login({ name: 'Bob', email: 'b@c.com' }, 't2');

    expect(store.isLoggedIn).toBe(true);
    expect(store.token).toBe('t2');
    expect(store.name).toBe('Bob');
    expect(store.email).toBe('b@c.com');
  });

  it('logout clears user and token', () => {
    const store = useUserStore();
    store.login({ name: 'Bob', email: 'b@c.com' }, 't3');

    store.logout();

    expect(store.isLoggedIn).toBe(false);
    expect(store.name).toBe('');
    expect(store.token).toBe('');
  });
});
