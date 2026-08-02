/**
 * EmailJS ile sınav sonucu e-postası göndermek için gereken kimlik bilgileri.
 * https://www.emailjs.com/ üzerinde ücretsiz bir hesap açıp bir "Email Service"
 * (kendi Gmail/Outlook hesabınızı bağlayarak) ve bir "Email Template"
 * oluşturduktan sonra buraya üç değeri de doldurun. Üçü de dolu olmadan
 * e-posta gönderimi sessizce devre dışı kalır — sınav akışı bundan etkilenmez.
 *
 * Şablonda (template) kullanılabilecek değişkenler için sendExamEmail.ts'e bakın.
 */
export const EMAILJS_CONFIG = {
  serviceId: '',
  templateId: '',
  publicKey: ''
};

export const isEmailConfigured = (): boolean =>
  !!(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);
