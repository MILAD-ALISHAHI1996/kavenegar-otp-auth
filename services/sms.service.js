const Kavenegar = require('kavenegar');
require('dotenv').config();

// تنظیم API کاوه‌نگار
const api = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API_KEY,
});

// نام قالب ثابت
const templateName = 'test'; // نام قالب تایید شده

// ارسال پیامک OTP
exports.sendOTP = async (receptor, token) => {
  try {
    const response = await new Promise((resolve, reject) => {
      api.VerifyLookup({ receptor, token, template: templateName }, (response, status) => {
        if (status === 200) {
          resolve(response);
        } else {
          reject(new Error('Failed to communicate with Kavenegar API'));
        }
      });
    });

    // بررسی برای قالب آرایه‌ای
    if (Array.isArray(response)) {
      const entry = response[0];
      if (entry && entry.status >= 1 && entry.status <= 10) {
        return entry;
      } else {
        const errText = entry?.statustext || 'OTP ارسال نشد';
        console.error('OTP status error:', errText);
        throw new Error(errText);
      }
    }

    // حالت fallback
    const errorMessage = response?.return?.message || 'Unknown error from Kavenegar API';
    console.error('OTP sending failed:', errorMessage);
    throw new Error(errorMessage);
  } catch (error) {
    console.error('Error in sendOTP:', error.message);
    throw error;
  }
};