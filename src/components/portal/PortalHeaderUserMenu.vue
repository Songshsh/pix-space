<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import { useLogout } from '../../composables/useLogout';
import { useUserStore } from '../../stores/user';
import { canAccessAdmin } from '../../utils/access';

const props = defineProps<{
  redirectPath: string;
}>();

const router = useRouter();
const { logout } = useLogout();
const userStore = useUserStore();

const currentUser = computed(() => userStore.username || 'U');
const hasUserAvatar = computed(() => Boolean(userStore.avatar));
const isLoggedIn = computed(() => userStore.isAuthenticated);
const canShowAdmin = computed(() => canAccessAdmin(userStore.role));

const goLogin = () => {
  router.push({ path: '/login', query: { redirect: props.redirectPath } });
};

const goProfile = () => {
  const userId = userStore.id;
  if (!userId) {
    goLogin();
    return;
  }
  router.push(`/u/${userId}/boards`);
};

const goAccount = () => {
  router.push('/account');
};

const goAdmin = () => {
  router.push('/admin/dashboard');
};

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <div class="avatar-wrapper">
      <el-avatar
        :size="32"
        :src="userStore.avatar"
        class="user-avatar"
        :class="{ 'user-avatar--fallback': !hasUserAvatar }"
      >
        <el-icon v-if="!isLoggedIn" class="user-avatar__icon">
          <UserFilled />
        </el-icon>
        <span v-else>{{ currentUser.charAt(0).toUpperCase() }}</span>
      </el-avatar>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-if="isLoggedIn">
          <el-dropdown-item @click="goProfile">个人主页</el-dropdown-item>
          <el-dropdown-item @click="goAccount">个人中心</el-dropdown-item>
          <el-dropdown-item v-if="canShowAdmin" @click="goAdmin">
            后台管理
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            退出登录
          </el-dropdown-item>
        </template>
        <template v-else>
          <el-dropdown-item @click="goLogin">登录</el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  transition: transform 0.2s ease;
}

.user-avatar__icon {
  font-size: 18px;
}

.user-avatar--fallback {
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  color: var(--ds-color-text-inverse);
  font-weight: 600;
}

.user-avatar:hover {
  transform: scale(1.05);
}
</style>
