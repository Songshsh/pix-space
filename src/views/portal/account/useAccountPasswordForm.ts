import type { FormInstance, FormRules } from 'element-plus';
import { usePasswordChange } from '../../../composables/usePasswordChange';
import {
  createPasswordForm,
  createPasswordFormRules,
} from '../../../composables/passwordForm';
import type { PasswordFormModel } from '../../../components/settings/types';

export function useAccountPasswordForm() {
  const { submitPasswordChange } = usePasswordChange();
  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const form = reactive<PasswordFormModel>(createPasswordForm());
  const rules = reactive<FormRules<PasswordFormModel>>(
    createPasswordFormRules(form)
  );

  const handleSubmit = async () => {
    if (!formRef.value || submitting.value) return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;

    submitting.value = true;
    try {
      await submitPasswordChange(
        form,
        {
          forceRelogin: true,
          reloginMessage: '密码已更新，请重新登录',
        },
        () => formRef.value?.clearValidate()
      );
    } catch {
      void 0;
    } finally {
      submitting.value = false;
    }
  };

  return {
    formRef,
    form,
    rules,
    submitting,
    handleSubmit,
  };
}
