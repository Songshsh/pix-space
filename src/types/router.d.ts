import type { MenuIconKey } from '../router';
import type { UserRole } from '../utils/access';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    roles?: UserRole[];
    showInMenu?: boolean;
    icon?: MenuIconKey;
  }
}
