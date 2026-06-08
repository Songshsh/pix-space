import { changePassword } from '../api/user';
import type { PasswordFormModel } from '../components/settings/types';
import { useLogout } from './useLogout';

export type PasswordChangeFormValue = PasswordFormModel;

export interface PasswordChangeOptions {
  successMessage?: string;
  reloginMessage?: string;
  forceRelogin?: boolean;
}

function resetPasswordForm(
  form: PasswordChangeFormValue,
  clearValidate?: () => void
) {
  form.oldPassword = '';
  form.newPassword = '';
  if (typeof form.confirmPassword === 'string') {
    form.confirmPassword = '';
  }
  clearValidate?.();
}

export function usePasswordChange() {
  const { logout } = useLogout();

  const submitPasswordChange = async (
    form: PasswordChangeFormValue,
    options?: PasswordChangeOptions,
    clearValidate?: () => void
  ) => {
    await changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    resetPasswordForm(form, clearValidate);

    if (options?.forceRelogin) {
      await logout({
        successMessage: options.reloginMessage || '密码已更新，请重新登录',
        redirectPath: '/login',
        replace: true,
      });
      return;
    }

    ElMessage.success(options?.successMessage || '密码修改成功');
  };

  return {
    submitPasswordChange,
  };
}
