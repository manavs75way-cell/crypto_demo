# CryptoX Client (Frontend)

This is the React frontend for the CryptoX crypto trading simulation platform. It provides a modern, high-performance interface for users and administrators.

## 🛠️ Technology Highlights

- **React 18 & Vite**: Fast development and optimized production builds.
- **React Router v7**: For fluid navigation and route protection.
- **Tailwind CSS**: A Utility-first CSS framework for custom, responsive designs.
- **Zod & React Hook Form**: Robust client-side validation for KYC and Auth forms.
- **Context API**: Managing user authentication and global states without Redux overhead.

## 📂 Folder Structure

- `src/api/`: Axios instance and domain-specific API calls (auth, kyc, trade, admin).
- `src/components/`: Reusable primitive and composite components.
- `src/context/`: Authentication context and provider.
- `src/hooks/`: Business logic extracted into custom hooks (e.g., `useTrade`, `useWallets`).
- `src/pages/`: Page-level components organized by feature areas.
- `src/types/`: Centralized TypeScript interfaces and types.

## 🚀 Available Scripts

### `npm run dev`
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run preview`
Locally preview the production build.

## 🔐 Route Protection

The application uses specialized guards:
- **ProtectedRoute**: Ensures a user is logged in before accessing their dashboard or profile.
- **AdminGuard**: Restricted access to the `/admin` path for users with the `admin` role only.

---

Designed for performance and visual excellence.
