# Fitness App Backend

A Node.js/Express backend for a subscription-based fitness and diet plan website.

## Features

- **Authentication**: JWT-based auth with role-based access control (member/trainer/admin)
- **Subscription Plans**: CRUD operations for plans (admin only)
- **Subscriptions**: Create, view, and manage user subscriptions
- **Payments**: Stripe integration for payment processing
- **Content Management**: Workouts and diet plans with trainer assignment
- **Progress Tracking**: Log and view user progress
- **Admin Dashboard**: Analytics and user management
- **Security**: Password hashing, rate limiting, CORS, helmet

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payments**: Stripe
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. Set up PostgreSQL database:
   ```bash
   createdb fitness_db
   psql -d fitness_db -f schema.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Plans
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create plan (admin)
- `PUT /api/plans/:id` - Update plan (admin)
- `DELETE /api/plans/:id` - Delete plan (admin)

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:userId` - Get user subscription
- `PUT /api/subscriptions/:id` - Update subscription

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:userId` - Get payment history
- `POST /api/payments/webhook` - Stripe webhook

### Content
- `GET /api/content/workout` - Get workouts
- `GET /api/content/diet` - Get diets
- `POST /api/content/assign` - Assign content (trainer)
- `GET /api/content/assigned/:memberId` - Get assigned content

### Progress
- `GET /api/progress/:userId` - Get progress
- `POST /api/progress` - Log progress

### Admin
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Database Schema

The database consists of the following tables:
- `users` - User accounts with roles
- `plans` - Subscription plans
- `subscriptions` - User subscriptions
- `payments` - Payment records
- `workouts` - Workout plans
- `diets` - Diet plans
- `assignments` - Trainer assignments to members
- `progress` - User progress logs

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Rate limiting prevents abuse
- CORS configured for frontend origin
- Helmet provides security headers

## Development

- Use `npm run dev` for development with nodemon
- Logs are output to console using Morgan
- Database queries use parameterized statements to prevent SQL injection

## Deployment

1. Set `NODE_ENV=production` in environment
2. Configure production database
3. Set up Stripe webhook endpoint
4. Deploy to your preferred hosting service (Heroku, AWS, etc.)

## License

This project is licensed under the MIT License.
