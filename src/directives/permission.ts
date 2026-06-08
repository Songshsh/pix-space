import type { Pinia } from 'pinia';
import type { ObjectDirective } from 'vue';
import { useUserStore } from '../stores/user';
import { hasPermission, type PermissionRole } from '../utils/access';

type PermissionElement = HTMLElement & {
  __permissionPlaceholder__?: Comment;
  __permissionRoles__?: PermissionRole;
  __permissionStop__?: () => void;
};

function updatePermissionVisibility(el: PermissionElement, allowed: boolean) {
  if (allowed) {
    const placeholder = el.__permissionPlaceholder__;
    if (placeholder?.parentNode && !el.parentNode) {
      placeholder.parentNode.replaceChild(el, placeholder);
    }
    return;
  }

  if (!el.parentNode) return;

  if (!el.__permissionPlaceholder__) {
    el.__permissionPlaceholder__ = document.createComment('v-permission');
  }

  el.parentNode.replaceChild(el.__permissionPlaceholder__, el);
}

export function createPermissionDirective(
  pinia: Pinia
): ObjectDirective<HTMLElement, PermissionRole> {
  const userStore = useUserStore(pinia);

  const applyPermission = (el: PermissionElement) => {
    updatePermissionVisibility(
      el,
      hasPermission(el.__permissionRoles__, userStore.role)
    );
  };

  const initPermissionWatcher = (el: PermissionElement) => {
    el.__permissionStop__?.();
    el.__permissionStop__ = watch(
      () => [userStore.role, userStore.isAuthenticated],
      () => {
        applyPermission(el);
      },
      {
        immediate: true,
        flush: 'sync',
      }
    );
  };

  return {
    mounted(el, binding) {
      const permissionEl = el as PermissionElement;
      permissionEl.__permissionRoles__ = binding.value;
      initPermissionWatcher(permissionEl);
    },
    updated(el, binding) {
      const permissionEl = el as PermissionElement;
      permissionEl.__permissionRoles__ = binding.value;
      applyPermission(permissionEl);
    },
    unmounted(el) {
      const permissionEl = el as PermissionElement;
      permissionEl.__permissionStop__?.();
      delete permissionEl.__permissionStop__;
      delete permissionEl.__permissionRoles__;
      delete permissionEl.__permissionPlaceholder__;
    },
  };
}
