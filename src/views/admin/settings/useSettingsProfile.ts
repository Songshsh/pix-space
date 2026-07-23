import { updateUserProfile } from '../../../api/user';
import type { ProfilePanelForm } from '../../../components/settings/types';
import { useUserStore } from '../../../stores/user';

export function useSettingsProfile() {
  const userStore = useUserStore();
  const profileSaving = ref(false);

  const profileForm = reactive<ProfilePanelForm>({
    username: userStore.username || '',
    email: userStore.email || '',
    phone: userStore.phone || '',
    bio: userStore.bio || '',
    avatar: userStore.avatar || '',
  });

  watch(
    () => [
      userStore.username,
      userStore.email,
      userStore.phone,
      userStore.bio,
      userStore.avatar,
    ],
    ([username, email, phone, bio, avatar]) => {
      profileForm.username = username || '';
      profileForm.email = email || '';
      profileForm.phone = phone || '';
      profileForm.bio = bio || '';
      profileForm.avatar = avatar || '';
    },
    { immediate: true }
  );

  const handleProfileSave = async () => {
    if (profileSaving.value) return;
    profileSaving.value = true;
    try {
      const result = await updateUserProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        bio: profileForm.bio.trim(),
        avatar: profileForm.avatar,
      });
      userStore.updateProfile(result);
      profileForm.username = result.username;
      profileForm.email = result.email;
      profileForm.phone = result.phone || '';
      profileForm.bio = result.bio || '';
      profileForm.avatar = result.avatar || '';
      ElMessage.success('个人资料保存成功');
    } catch {
      void 0;
    } finally {
      profileSaving.value = false;
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      ElMessage.warning('请选择图片文件');
      return;
    }
    if (file.size > 1024 * 1024) {
      ElMessage.warning('头像图片请控制在 1MB 以内');
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('头像读取失败'));
        reader.readAsDataURL(file);
      });
      profileForm.avatar = dataUrl;
    } catch {
      ElMessage.error('头像读取失败，请重试');
    }
  };

  return {
    profileForm,
    profileSaving,
    handleProfileSave,
    handleAvatarChange,
  };
}
