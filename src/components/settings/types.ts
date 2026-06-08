export interface ProfilePanelForm {
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

export interface AppearanceSettingsForm {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  collapsedSidebar: boolean;
}

export interface NotificationSettingsForm {
  system: boolean;
  email: boolean;
  upload: boolean;
  comment: boolean;
}

export interface PasswordFormModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type SecurityPanelForm = PasswordFormModel;

export interface SystemSettingsForm {
  language: string;
  timezone: string;
  dateFormat: string;
  autoBackup: boolean;
}
