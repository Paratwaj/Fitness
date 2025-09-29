# Integration Plan for Backend APIs

## Overview
This TODO tracks the step-by-step implementation of backend API integration for the fitness app. Steps are broken down logically from the approved plan. Each step will be marked as completed once verified.

## Steps

### 1. Install Dependencies
- [ ] Run `npm install axios react-hot-toast @stripe/stripe-js stripe jwt-decode` to add API client, notifications, Stripe payments, and JWT decoding.
- [ ] Verify installation by checking package.json and running `npm run dev` without errors.

### 2. Create API Service
- [x] Create `src/services/api.js`: Axios instance with baseURL (default: http://localhost:5000), request/response interceptors for JWT auth (add Authorization header from localStorage), error handling (toasts for 401/500 errors).
- [x] Export functions for all endpoints: auth (login/register), plans (GET/POST/PUT/DELETE), subscriptions (GET/POST/PUT), content (GET/POST assign), progress (GET/POST), payments (GET/POST), admin (analytics/users).
- [ ] Test: Import in a temp file or console.log to ensure setup.

### 3. Update AuthContext.jsx
- [x] Replace mock login/register with real API calls using the api service (POST /auth/login, /auth/register).
- [x] On success, store JWT in localStorage, decode with jwt-decode to extract user data/role, set user state.
- [x] Add logout: Clear localStorage, set user null.
- [x] Persist: On mount, check localStorage for JWT, decode and set user if valid.
- [x] Add isAuthenticated check based on token presence.
- [x] Handle loading and errors with toasts.
- [x] Update useAuth to expose token for API headers.

### 4. Update App.jsx
- [x] Import and wrap entire app with <Toaster /> from react-hot-toast for global notifications.
- [x] Update ProtectedRoute: Check for token in localStorage or useAuth().isAuthenticated, decode role from token.
- [x] Ensure role-based redirects work with real roles from JWT.
- [ ] Add any global error boundary if needed.

### 5. Update Auth Pages (Login/Register)
- [x] Read and update src/pages/Auth/Login.jsx: Use useAuth().login, handle form submit, loading state, success redirect to dashboard based on role, error toast.
- [x] Read and update src/pages/Auth/Register.jsx: Similar to Login, use useAuth().register, on success auto-login or redirect to login.
- [x] Add form validation (e.g., email/password required).

### 6. Update Pricing.jsx
- [x] Fetch plans: Use useEffect to call GET /plans, replace static plans array with fetched data.
- [x] Update subscribe button: If not auth, redirect to /login; else, open Stripe checkout or Elements for card payment.
- [x] On payment success (via Stripe confirm), call POST /subscriptions {plan_id, payment_id}, then POST /payments.
- [x] Show loading during fetch/payment, error toasts.
- [x] Create helper component if needed for payment form.

### 7. Update MemberDashboard.jsx
- [x] Fetch data: useEffect for GET /subscriptions/:userId, /content/workout, /content/diet, /progress/:userId, /payments/:userId.
- [x] Replace mocks with fetched data; use Recharts for progress chart (weight over time).
- [x] Update weight form: On submit, POST /progress {weight, date}, refresh progress data.
- [x] Add subscription renewal/upgrade: Button to PUT /subscriptions/:id {new_plan_id}, trigger payment if needed.
- [x] Display payment history in a table/section.
- [x] Add photo upload for progress (POST /progress with file, use FormData).
- [x] Handle loading spinners, error toasts.

### 8. Update TrainerDashboard.jsx
- [x] Read file if needed, fetch assigned members: GET /users?role=member&trainerId=... or similar API.
- [x] Display members list with cards (name, progress summary).
- [x] Add assign form: Select member, workout/diet plan, POST /content/assign {member_id, content_type, content_id}.
- [x] Handle multiple assignments, loading, errors.

### 9. Update AdminDashboard.jsx
- [x] Read file if needed, fetch analytics: GET /admin/analytics, display metrics (members, revenue, subscriptions) in cards/charts.
- [x] Add plans management: Table with CRUD - GET /plans, forms for POST/PUT /plans, DELETE /plans/:id.
- [x] Add users management: GET /users, table with search/filter, PUT/DELETE /users/:id forms/modals.
- [x] Use Recharts for analytics charts, loading states.

### 10. Global Polish
- [x] Ensure all API calls use auth token via interceptor.
- [x] Add responsive checks: Test mobile views for forms/tables/charts.
- [x] Implement toast notifications for all success/error cases (e.g., "Login successful", "Subscription created").
- [x] Error handling: 401 → logout and redirect to login; 403 → unauthorized toast.
- [x] Run `npm run lint` and fix issues.

### 11. Testing & Verification
- [x] Run `npm run dev`, test full flows: Register/login (different roles), view Pricing/subscribe (simulate payment), dashboard fetches/updates.
- [x] Simulate backend responses if needed (e.g., via browser dev tools).
- [x] Check localStorage for JWT persistence across refreshes.
- [x] Verify role-based access: Member can't access /admin, etc.

## Notes
- Backend baseURL: http://localhost:5000 (adjust if needed).
- Payments: Using Stripe; confirm if Razorpay preferred.
- JWT: Assumes role in payload; decode on login.
- Mark steps as [x] when complete, update file after each major step.
