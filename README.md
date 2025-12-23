# E-Waste – Smart Scrap & Recycling Platform

A production-grade, startup-ready platform for scheduling multi-item scrap pickups, real-time pricing, collector workflows, and admin analytics.

This is **not a college project**.  
This codebase is designed for real users, real money, and real scale.

---

## 🚀 What This Project Solves

- Customers can sell **multiple scrap items in one pickup**
- Transparent **estimated pricing** before pickup
- Final weight & payout confirmed by collectors
- Role-based workflows: Customer, Collector, Admin
- Scalable frontend + backend architecture

---

## 🧱 Tech Stack

### Frontend
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Role-based routing & guards
- Centralized API service layer
- World-class UX patterns (skeletons, empty states, validation)

### Backend
- Node.js + TypeScript
- Express + Prisma
- PostgreSQL (via Prisma)
- JWT authentication + role-based access
- Clean service / controller / repository separation

---

## 🧠 Architecture Highlights

- **Multi-item pickup model** (future-proof for audits & disputes)
- **Pure calculation utilities** (UI-agnostic, backend-agnostic)
- **Typed contracts** between frontend & backend
- **No UI logic mixed with business logic**
- **Startup-grade folder structure**

---

## 🧪 Current Status

- ✅ Phase 1: Frontend foundation complete
- ✅ UX audit completed and applied to key screens
- ✅ Multi-item pickup data models & UI components added
- ⏭️ Next: Wiring multi-item flow into SchedulePickup

Detailed docs:
- `PHASE1_IMPLEMENTATION.md`
- `UX_AUDIT_AND_IMPROVEMENT_PLAN.md`
- `backend/API_CONTRACT.md`

---

## 🏃‍♂️ Running Locally

### Frontend
```bash
npm install
npm run dev
