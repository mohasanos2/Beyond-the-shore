/**
 * EmailJS Configuration — Beyond The Shore
 * SETUP: Copy this file → rename to emailjs-config.js → fill in your values
 * Get values from: https://dashboard.emailjs.com
 * IMPORTANT: Add domain restriction in EmailJS dashboard → Account → API Keys
 */
window.EMAILJS_CONFIG = {
  publicKey:  'MukxMZP_vYF8j7zBQ',
  serviceId:  'service_0zc6kfh',
  templateId: 'template_fu5qetf',
  toEmail:    'beyondtheshore.egypt@gmail.com'
};

(function() {
  const c = window.EMAILJS_CONFIG;
  if (c.publicKey === 'REPLACE_WITH_YOUR_PUBLIC_KEY') {
    console.warn('[EmailJS] Not configured — email sending disabled.');
    return;
  }
  emailjs.init({ publicKey: c.publicKey });
  console.info('[EmailJS] Ready.');
})();
