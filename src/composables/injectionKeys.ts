import type { InjectionKey } from 'vue';

export const scrollContainerKey: InjectionKey<() => HTMLElement | null> =
  Symbol('scrollContainer');
