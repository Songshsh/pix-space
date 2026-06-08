<template>
  <StarryStatusPage
    code="404"
    description="抱歉，您探索的像素空间不存在或已被移除"
    button-text="返回首页"
    @back="handleGoBack"
  />
</template>

<script setup lang="ts">
import StarryStatusPage from '../../../components/StarryStatusPage.vue';
import { useUserStore } from '../../../stores/user';
import { canAccessAdmin } from '../../../utils/access';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const handleGoBack = () => {
  const from = route.query.from;
  const fromPath =
    typeof from === 'string' && from
      ? from
      : typeof route.path === 'string'
        ? route.path
        : '';

  if (!userStore.isAuthenticated) {
    router.push('/explore');
    return;
  }

  if (fromPath.startsWith('/admin') && canAccessAdmin(userStore.role)) {
    router.push('/admin/dashboard');
    return;
  }

  router.push('/explore');
};
</script>
