# CryptoX Server (Backend)

This is the Node.js backend for the CryptoX platform, built with Express and TypeScript. It follows a modular structure where each domain feature is encapsulated in its own directory.

## 🛠️ Technology Highlights

- **Express.js**: Fast and minimalist web framework.
- **TypeScript**: Static typing for better developer experience and reliability.
- **MongoDB & Mongoose**: Flexible document-based storage for users, KYC, and trades.
- **JWT & Cookies**: Secure, stateless authentication using JSON Web Tokens stored in cookies.
- **Zod**: Runtime schema validation for API requests.

## 📂 Modular Architecture

The server is organized into feature-based modules located in `src/modules/`:

- **Auth**: User registration, login, and session management.
- **KYC**: Multi-step identity verification processing.
- **Admin**: Administrative endpoints for oversight and KYC review.
- **Wallet**: Managing crypto balances and addresses.
- **Trade**: Order execution and transaction history.
- **Withdraw**: Processing withdrawal requests.

## 🚀 Available Scripts

### `npm run dev`
Starts the development server using `ts-node-dev`.

### `npm run build`
Compiles the TypeScript code into production-ready JavaScript in the `dist` folder.

### `npm run start`
Runs the compiled server from the `dist` directory.

## 📝 API Endpoints Summary

### Public
- `POST /api/auth/register`
- `POST /api/auth/login`

### Private (User)
- `GET /api/kyc/status`
- `POST /api/kyc/submit`
- `GET /api/trade/history`
- `POST /api/trade/execute`

### Private (Admin)
- `GET /api/admin/kyc/pending`
- `PATCH /api/admin/kyc/:id/review`
- `GET /api/admin/trades`
- `GET /api/admin/users`

## ⚙️ Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing tokens
- `CLIENT_URL`: URL of the frontend (for CORS)

---

Reliable, scalable, and modular backend.
