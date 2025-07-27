# Nox Metals Frontend

A modern Next.js 14 frontend application for the Nox Metals Product Management System. The live system can be access here [https://nox-metals-frontend.vercel.ap](https://nox-metals-frontend.vercel.ap)

# Project Overview
- Implement a login page that allows users to authenticate &#x2713;
- Users should be able to sign up and log in &#x2713;
- Securely handle authentication on the backend &#x2713;
- Add role-based access control (e.g., “Admin”, “User”) &#x2713;
- Only Admins can add/delete products &#x2713;
- Regular Users can only view products &#x2713;


## 🚀 Features

- **Authentication & Authorization**: Login/signup with role-based access control
- **Product Management**: View, create, edit, and delete products (Admin only)
- **Modern UI**: Built with Tailwind CSS
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript support
- **Form Validation**: React Hook Form with Zod validation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 📦 Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=Nox Metals
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── products/         # Product-related components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── stores/              # Zustand stores
│   ├── authStore.ts     # Authentication state
│   └── productStore.ts  # Product state
└── types/               # TypeScript type definitions
    ├── auth.ts          # Authentication types
    └── product.ts       # Product types
```

## 🔐 Authentication

The application supports two user roles:

- **User**: Can view products only
- **Admin**: Can view, create, edit, and delete products

### Default Admin Account

Use the default admin account created by the backend:
- Email: `admin@noxmetals.com`
- Password: `admin123`

## 🎨 UI Components

### Button
```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Input
```tsx
import Input from '@/components/ui/Input';

<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  error={errors.email?.message}
/>
```

## 📱 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔗 API Integration

The frontend communicates with the backend API through the `apiClient` in `src/lib/api.ts`. All API calls include:

- Automatic token management
- Error handling
- Request/response interceptors
- Type-safe responses

## 🚀 Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

