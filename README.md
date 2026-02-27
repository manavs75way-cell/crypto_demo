# CryptoX - Crypto Trading Simulation Platform

CryptoX is a full-stack cryptocurrency trading simulation platform where users can sign up, complete KYC verification, deposit demo funds, and trade between various cryptocurrencies. It includes a comprehensive Admin Dashboard for managing KYC applications and monitoring platform-wide trades.

## Key Features

### 👤 User Features
- **Authentication**: Secure sign-up/login with JWT-based authentication.
- **KYC Verification**: Multi-step identity verification process with status tracking (Pending, Approved, Rejected).
- **Demo Wallet**: Automatically assigns wallets for supported currencies (BTC, ETH, USDT, BNB, SOL, XRP).
- **Trading**: Real-time price simulation and instant swaps between crypto pairs with a 0.1% fee.
- **Deposits/Withdrawals**: Demo deposit simulator and withdrawal interface with network fee calculation.
- **Dashboard**: Modern, responsive UI with real-time portfolio value and transaction history.

### 🛡️ Admin Features
- **Admin Dashboard**: Dedicated interface for administrative oversight.
- **KYC Management**: Review pending applications, approve them, or reject them with specific reasons.
- **Platform Monitoring**: View every trade and transaction happening across the platform.
- **User Management**: Overview of all registered users and their current KYC status.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **State Management**: React Context API & Custom Hooks
- **Icons**: Lucide React & Custom SVGs
- **Validation**: Zod (for forms)

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with Cookie-based persistence
- **Validation**: Zod (backend schema validation)

## 📦 Project Structure

```text
.
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/            # API service layer (Axios)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and global state
│   │   ├── hooks/          # Custom hooks for features
│   │   ├── pages/          # Page components & layouts
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
└── server/                 # Express backend application
    ├── src/
    │   ├── config/         # Environment & database config
    │   ├── middleware/     # Auth & Error middlewares
    │   ├── modules/        # Domain-driven feature modules (Auth, Admin, Trade, etc.)
    │   ├── models/         # Mongoose schemas
    │   └── utils/          # Seeding & price feeding utilities
```

## 🚥 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a URI from Atlas)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task1
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file based on the environment needs
   # Default values: PORT=5000, MONGO_URI, JWT_SECRET, etc.
   npm run dev
   ```
   *Note: On first startup, an admin account will be seeded automatically.*
   - **Admin Email**: `admin@cryptox.com`
   - **Admin Password**: `admin123`

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 🔒 Security
- Password hashing with Bcrypt.
- Protected routes using custom guards (`AdminGuard`, `ProtectedRoute`).
- Role-based Access Control (RBAC) on the backend.

---

Created with ❤️ for the CryptoX Platform Assignment.
