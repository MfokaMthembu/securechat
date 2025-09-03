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
  - Super Admin: create/manage users (CRUD for user management)
  - Roles/Permissions seeded for consistency
- 🛠 **Group Management**
  - Create/manage Unit Groups (CRUD for group management)
  - Pivot table includes role & join date
- **Assigning Unit Commanders (sub-admin) to unit groups**
  - sysadmin (super-admin) assigns sub-admin (Unit Commander) as group admins
  - Able to search and select multiple users for mass assignment or addition into the group
- **System Wide Alerts**
  - Able to send and view alerts
  - Can select location via latitude and longitude or visual map
- **Group Chat for both Unit Commanders & Personnel**
   - Unit commanders able to send & recieve group messages
   - Personnel are able to send & recieve messages
       - **Pending completion**
         - info modal to show members in a group or search through them
         - group admins (sub-admin) for opening and closing the group in regards to sending messages
         - push notifications via FCM 
- 🌐 **Frontend**
  - React Router DOM for navigation
  - Axios instance for API communication
  - Protected routes for authenticated users
  - leaflet js for visual maps
  - Group Chat component
  - Alerts component (cards and buttons to call form modal)
  - firebase for firebase .env variables
  - service worker for messaging
  - hooks for fcm token storing and vapid verification

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
