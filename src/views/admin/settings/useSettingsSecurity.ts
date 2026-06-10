import { getUserPreferences, updateUserPreferences } from '../../../api/user';
import type { SecurityPanelForm } from '../../../components/settings/types';
import {
  createPasswordForm,
  createPasswordFormRules,
} from '../../../composables/passwordForm';
import { usePasswordChange } from '../../../composables/usePasswordChange';
import type { FormInstance, FormRules } from 'element-plus';
import { useRequestSequencer } from '../../../composables/requestSequencer';

export function useSettingsSecurity() {
  const { submitPasswordChange } = usePasswordChange();
  const securityFormRef = ref<FormInstance>();
  const securitySaving = ref(false);
  const preferencesLoading = ref(false);
  const preferencesLoaded = ref(false);
  const preferencesError = ref('');
  const twoFactorSaving = ref(false);
  const savedTwoFactorEnabled = ref(false);
  const twoFactorEnabled = ref(false);
  const sequencer = useRequestSequencer();
  let preferencesVersion = 0;

  const securityForm = reactive<SecurityPanelForm>(createPasswordForm());
  const securityRules = reactive<FormRules<SecurityPanelForm>>(
    createPasswordFormRules(securityForm)
  );

  const handleSecuritySubmit = async () => {
    if (!securityFormRef.value || securitySaving.value) return;
    const valid = await securityFormRef.value.validate().catch(() => false);
    if (!valid) return;

    securitySaving.value = true;
    try {
      await submitPasswordChange(
        {
          oldPassword: securityForm.oldPassword,
          newPassword: securityForm.newPassword,
          confirmPassword: securityForm.confirmPassword,
        },
        {
          forceRelogin: true,
          reloginMessage: '密码已更新，请重新登录',
        },
        () => securityFormRef.value?.clearValidate()
      );
    } catch {
      void 0;
    } finally {
      securitySaving.value = false;
    }
  };

  const loadSecurityPreferences = async () => {
    const requestId = sequencer.next();
    const snapshotVersion = preferencesVersion;
    preferencesLoading.value = true;
    preferencesError.value = '';
    try {
      const result = await getUserPreferences({ silentError: true });
      if (
        requestId !== sequencer.currentSeq ||
        snapshotVersion !== preferencesVersion
      ) {
        return null;
      }
      twoFactorEnabled.value = result.twoFactorEnabled;
      savedTwoFactorEnabled.value = result.twoFactorEnabled;
      preferencesLoaded.value = true;
      preferencesError.value = '';
      return result;
    } catch {
      if (requestId === sequencer.currentSeq) {
        preferencesLoaded.value = false;
        preferencesError.value = '偏好加载失败，请重试';
      }
      return null;
    } finally {
      if (requestId === sequencer.currentSeq) {
        preferencesLoading.value = false;
      }
    }
  };

  const handleTwoFactorToggle = async (value: boolean) => {
    if (
      twoFactorSaving.value ||
      !preferencesLoaded.value ||
      preferencesLoading.value ||
      preferencesError.value
    ) {
      return;
    }
    const previous = savedTwoFactorEnabled.value;
    preferencesVersion += 1;
    twoFactorEnabled.value = value;
    twoFactorSaving.value = true;
    try {
      const result = await updateUserPreferences(
        { twoFactorEnabled: value },
        { silentError: true }
      );
      twoFactorEnabled.value = result.twoFactorEnabled;
      savedTwoFactorEnabled.value = result.twoFactorEnabled;
      ElMessage.success(
        result.twoFactorEnabled ? '两步验证已启用' : '两步验证已关闭'
      );
    } catch {
      twoFactorEnabled.value = previous;
    } finally {
      twoFactorSaving.value = false;
    }
  };

  return {
    securityForm,
    securityRules,
    securityFormRef,
    securitySaving,
    preferencesLoading,
    preferencesLoaded,
    preferencesError,
    twoFactorSaving,
    twoFactorEnabled,
    loadSecurityPreferences,
    handleSecuritySubmit,
    handleTwoFactorToggle,
  };
}
