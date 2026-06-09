// 此模块提供纯工厂函数（createPasswordForm / createPasswordFormRules），
// 非 Vue composable（不依赖组件生命周期、不返回响应式状态）。
// 因与 PasswordForm 组件紧密关联，故放在 composables 目录。
import type { FormRules } from 'element-plus';
import type { PasswordFormModel } from '../components/settings/types';

export function createPasswordForm(): PasswordFormModel {
  return {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

export function createPasswordFormRules(
  form: PasswordFormModel
): FormRules<PasswordFormModel> {
  return {
    oldPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (_rule, value: string, callback) => {
          if (value !== form.newPassword) {
            callback(new Error('两次输入的新密码不一致'));
            return;
          }
          callback();
        },
        trigger: 'blur',
      },
    ],
  };
}
