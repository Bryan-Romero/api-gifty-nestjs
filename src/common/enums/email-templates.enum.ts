import { ConfirmEmailContext } from '../interfaces';

// email-templates.enum.ts
export enum EmailTemplate {
  CONFIRM_EMAIL = 'confirm-email',
  FORGOT_PASSWORD = 'forgot-password',
  // WELCOME = 'welcome',
  // RESET_PASSWORD = 'reset-password',
  // ORDER_CONFIRMATION = 'order-confirmation',
  // INVOICE = 'invoice',
}

export type EmailContextMap = {
  [EmailTemplate.CONFIRM_EMAIL]: ConfirmEmailContext;
  [EmailTemplate.FORGOT_PASSWORD]: ConfirmEmailContext;
};
