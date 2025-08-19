# LDF's Secure Chat App (MVP)

## Overview
This is the MVP for the **LDF's Secure Chat App**, built with:

- **Backend:** Laravel 11 (API only)
- **Frontend:** React
- **Auth & Security:** Laravel Sanctum, Spatie Roles/Permissions
- **Communication:** Axios (frontend ↔ backend)
- **Email OTPs:** Brevo (for password reset verification)

---

## Features
- 🔑 **Authentication Service**
  - Login, Logout
  - Password reset via **OTP (Brevo)**
  - Sanctum-secured API endpoints
- 👤 **User Management**
  - Super Admin: create/manage users
  - Roles/Permissions seeded for consistency
- 🛠 **Group Management**
  - Create/manage Unit Groups
  - Pivot table includes role & join date
- 🌐 **Frontend**
  - React Router DOM for navigation
  - Axios instance for API communication
  - Protected routes for authenticated users
- 📡 **Planned Next**
  - Real-time messaging via **WebSockets** for unit-wide group messaging

---

## Tech Notes
- **Timezone:** Adjusted in `config/app.php` & `.env` to match local deployment.
- **CORS:** Configured to allow React frontend to call Laravel API.
- **Carbon:** Used for consistent date/time handling.

---

## Repo Structure
- `backend/` → Laravel 11 API
  - `app/Http/Controllers/AuthController.php`
  - `app/Http/Controllers/UserController.php`
  - `app/Http/Controllers/UnitGroupController.php`
- `frontend/` → React App
  - `src/App.jsx` (entry point)
  - `src/routes.jsx` (routing setup)
  - `src/services/axios.js` (Axios instance)

---

## Quick Start
### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan migrate --seed
php artisan serve

### web-frontend
cd web-frontend
npm install
npm run dev
