import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from './user';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('useUserStore', () => {
  it('login writes user info and validates session', () => {
    const store = useUserStore();

    store.login({ id: 1, name: 'Bob', email: 'b@c.com', role: 'admin' });

    expect(store.isLoggedIn).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.name).toBe('Bob');
    expect(store.email).toBe('b@c.com');
    expect(store.role).toBe('admin');
  });

  it('logout clears user info and session state', () => {
    const store = useUserStore();
    store.login({ id: 1, name: 'Bob', email: 'b@c.com', role: 'admin' });

    store.logout();

    expect(store.isLoggedIn).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(store.name).toBe('');
    expect(store.email).toBe('');
  });
});
