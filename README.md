# MediCare+ — Healthcare Management System

A full-stack healthcare platform built with Next.js and Node.js/Express, featuring real-time appointment booking, M-Pesa & Stripe payment integrations, role-based dashboards (Patient / Doctor / Admin), and JWT-based authentication.

**[View Live Demo →](https://healthcare-system-eta.vercel.app)**

---

## 🎬 Try It Live

No signup required — click **"View as Patient"** or **"View as Doctor"** on the login page, or use these credentials directly:

| Role    | Email                        | Password  |
|---------|------------------------------|-----------|
| Patient | demo.patient@medicare.com    | Demo1234  |
| Doctor  | jane.wangui@medicare.com     | Demo1234  |

The demo patient account has pre-loaded appointment history across every status (pending, confirmed, completed, cancelled) and payment history via both Stripe and M-Pesa, so you can explore the full booking and payment flow immediately.

---

## Features

- **Real-time doctor availability** — doctors set weekly slots; patients see live open times
- **Appointment booking** — filter doctors by specialization, view profiles & fees, book instantly
- **Dual payment integration** — Stripe (card) and M-Pesa (Safaricom STK push)
- **Role-based dashboards** — separate UX for patients, doctors, and admins
- **JWT auth** — access/refresh token rotation with Axios interceptors
- **Email notifications** — confirmation emails via Nodemailer on appointment events
- **Admin controls** — user management, suspension, payment refunds

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State       | Zustand, TanStack Query                         |
| Backend     | Node.js, Express, TypeScript                    |
| Database    | PostgreSQL (via `pg`)                           |
| Auth        | JWT (access + refresh tokens)                   |
| Payments    | Stripe, M-Pesa Daraja API                       |
| Email       | Nodemailer                                      |
| Deployment  | Vercel (frontend), Render (backend)             |

---

## Getting Started (Local Development)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Login & Register
│   ├── dashboard/       # Role-based dashboards (patient / doctors / admin)
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
├── hooks/               # TanStack Query hooks (useAuth, useAppointments, etc.)
├── lib/                 # Axios client, query client, utilities
├── store/               # Zustand auth store
└── types/               # TypeScript interfaces
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
