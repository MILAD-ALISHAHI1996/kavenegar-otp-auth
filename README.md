# 🔐 Kavenegar OTP Authentication API

A simple and clean Node.js + Express API for sending and verifying One-Time Passwords (OTP) via SMS using the [Kavenegar](https://kavenegar.com) service.

This project is designed as a portfolio-ready example to demonstrate the ability to integrate third-party SMS gateways (like Kavenegar) for secure mobile authentication.

---

## ✨ Features

- ✅ Send 4-digit OTP codes via Kavenegar templated SMS
- 🕒 Store OTPs in Redis with 5-minute expiration
- 🔒 Secure verification of OTPs
- 📱 JWT token generation upon successful login
- 🧩 Clean project structure (controllers, services, routes)

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/MILAD-ALISHAHI1996/kavenegar-otp-auth
cd kavenegar-otp-auth
