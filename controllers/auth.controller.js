const redisClient = require('../config/redis');
const smsService = require('../services/sms.service');
const jwt = require('jsonwebtoken');
const Customers = require('../models/Customer'); // اگر مدل نداری، حذف کن

// ارسال OTP
exports.sendOTP = async (req, res) => {
  const { receptor } = req.body;

  if (!/^09\d{9}$/.test(receptor)) {
    return res.status(400).json({
      success: false,
      message: 'شماره موبایل نامعتبر است. فرمت صحیح: 09XXXXXXXXX'
    });
  }

  try {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await redisClient.setEx(`otp:${receptor}`, 300, token);

    const smsResponse = await smsService.sendOTP(receptor, token);

    return res.status(200).json({
      success: true,
      message: `کد تایید به ${receptor} ارسال شد.`,
      response: smsResponse,
      otp: process.env.NODE_ENV === 'development' ? token : undefined
    });
  } catch (error) {
    console.error('❌ خطا در ارسال OTP:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'ارسال کد با خطا مواجه شد.',
      error: error.message || 'خطای ناشناخته'
    });
  }
};

// تایید OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!/^09\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'شماره موبایل نامعتبر است.' });
    }

    const storedOtp = await redisClient.get(`otp:${phoneNumber}`);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'کد تایید اشتباه یا منقضی شده است.' });
    }

    await redisClient.del(`otp:${phoneNumber}`);

    let customer = await Customers.findOne({ where: { PhoneNumber: phoneNumber } });

    if (!customer) {
      customer = await Customers.create({
        PhoneNumber: phoneNumber,
        CustomerUniqueID: Math.floor(100000000 + Math.random() * 900000000),
        FirstName: 'کاربر',
        LastName: 'جدید',
        Email: `guest_${Date.now()}@example.com`,
        CreatedAt: new Date(),
        IsActive: true
      });
    }

    const token = jwt.sign(
      {
        customerId: customer.CustomerID,
        phoneNumber: customer.PhoneNumber
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      customerId: customer.CustomerID,
      token
    });
  } catch (error) {
    console.error('❌ خطا در تایید کد:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در تایید کد.',
      error: error.message
    });
  }
};
