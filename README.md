# Unfazed

> A SaaS platform for therapists in India to manage clients, scheduling,
> clinical documentation, payments, packages, analytics, and
> communication.

## Overview

Unfazed is a full-stack web application with a React frontend and
Node.js/Express backend backed by MongoDB. It provides therapist
management tools and a client-facing booking experience.

## Features

* Therapist registration and JWT login
* bcrypt password hashing
* Therapist profiles and branded therapist URLs
* Therapist availability and client booking
* Client CRM
* Intake and digital consent tracking
* Private/shared clinical notes
* Session packages (3, 6, and 12 sessions)
* Razorpay Test Mode payments
* Payment signature verification
* Centralized subscription entitlement service
* Feature gating for Analytics, Notes, and Payments
* Therapist analytics dashboard
* Socket.IO real-time chat
* Basic notification service

## Architecture

``` text
React Frontend
      |
      | Axios / Socket.IO
      v
Node.js + Express API
      |
      +---- Authentication / JWT
      +---- Entitlement Middleware
      +---- Controllers / Services
      +---- Socket.IO
      |
      v
MongoDB
```

The entitlement flow is centralized:

``` text
Request
  -> JWT Authentication
  -> Entitlement Middleware
  -> entitlementService.canAccess()
  -> SubscriptionTierConfig
  -> Allow / Deny
```

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Socket.IO Client
* JavaScript

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Express Validator
* Razorpay
* Socket.IO
* dotenv
* CORS

## Project Structure

``` text
unfazed/
├── unfazed-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── sockets/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── unfazed-frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   └── routes/
    ├── package.json
    └── index.html
```

## Important API Endpoints

### Authentication

``` text
POST /api/auth/register
POST /api/auth/login
```

### Therapist

``` text
GET /api/therapists/public/:slug
```

### Clients

``` text
GET /api/clients
GET /api/clients/:clientId
PUT /api/clients/:clientId/intake
```

### Scheduling

``` text
GET /api/scheduling/availability
POST /api/scheduling/book
GET /api/scheduling/therapist/availability
POST /api/scheduling/therapist/availability
```

### Notes

``` text
GET /api/notes/client/:clientId
POST /api/notes/client/:clientId
PUT /api/notes/:noteId
DELETE /api/notes/:noteId
```

### Payments

``` text
GET /api/payments/packages
POST /api/payments/packages
POST /api/payments/clients/:clientId/packages
GET /api/payments/clients/:clientId/packages
POST /api/payments/clients/:clientId/payment-order
POST /api/payments/verify
```

### Analytics

``` text
GET /api/analytics
```

Protected endpoints use:

``` text
Authorization: Bearer <JWT\_TOKEN>
```

## Environment Variables

### Backend

Create `unfazed-backend/.env`:

``` env
PORT=5000
MONGO\_URI=your\_mongodb\_connection\_string
JWT\_SECRET=your\_jwt\_secret
RAZORPAY\_KEY\_ID=your\_razorpay\_test\_key\_id
RAZORPAY\_KEY\_SECRET=your\_razorpay\_test\_key\_secret
```

### Frontend

Create `unfazed-frontend/.env`:

``` env
VITE\_API\_BASE\_URL=http://localhost:5000/api
VITE\_RAZORPAY\_KEY\_ID=your\_razorpay\_test\_key\_id
```

**Never commit `.env` files or secret keys to GitHub.**

## Installation

### Backend

``` bash
cd unfazed-backend
npm install
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### Frontend

In a second terminal:

``` bash
cd unfazed-frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

## Typical User Flow

### Therapist

``` text
Register -> Login -> Profile
                    |
                    v
              Availability
                    |
                    v
              Client Booking
                    |
                    v
              Client CRM
                    |
          +---------+---------+
          |                   |
      Notes              Packages/Payments
          |                   |
          +---------+---------+
                    |
                 Analytics
```

### Client

``` text
Therapist branded link
        -> Therapist profile
        -> Available slots
        -> Booking
        -> Payment
```

### Communication

``` text
Therapist <-> Socket.IO Chat Room <-> Client
```

## Entitlement System

`SubscriptionTierConfig` stores a therapist's tier and feature
configuration.

Example:

``` js
{
  tier: "free",
  features: {
    notes: true,
    payments: true,
    analytics: false,
    chat: false,
    advancedAnalytics: false
  }
}
```

Feature access is checked through:

``` js
canAccess(therapistId, featureKey)
```

This avoids hardcoded tier checks inside individual controllers.

## Security

* Passwords are hashed using bcrypt.
* Protected routes require JWT authentication.
* Therapist-scoped queries protect client data between therapists.
* Razorpay payment signatures are verified server-side.
* Razorpay secrets remain on the backend.
* Private clinical notes are not exposed through client-facing APIs.
* `.env` files are excluded from version control.

## Current Status

### Implemented

* \[x] Authentication
* \[x] Therapist profile and branded URL
* \[x] Scheduling and booking
* \[x] Client CRM
* \[x] Intake and consent
* \[x] Clinical notes
* \[x] Packages
* \[x] Razorpay Test Mode
* \[x] Payment verification
* \[x] Entitlement service
* \[x] Analytics API and dashboard
* \[x] Analytics/Notes/Payments feature gating
* \[x] Socket.IO real-time chat
* \[x] Basic notification service

### Future Enhancements

* Persistent chat history
* Read receipts
* Advanced intake builder
* WhatsApp integration
* Email notification delivery
* SOAP/DAP templates
* Advanced analytics
* Enhanced invoice generation
* Automated subscription billing
* Production hardening

## Academic Project

Unfazed was developed as an academic Major Project to demonstrate
full-stack web development, database design, authentication,
authorization, scheduling, payments, entitlement-based architecture,
analytics, and real-time communication.

## License

This project was developed for academic purposes.

