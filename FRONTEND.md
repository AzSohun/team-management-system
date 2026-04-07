# Team Management System - Frontend Guide

## Overview

The frontend is built with **Next.js 16.2.1**, **React 19.2.4**, and **Tailwind CSS 4**. It provides a complete user interface for managing teams, users, and user roles.

## Project Structure

```
app/
├── (auth)/                    # Authentication pages (login, register)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/               # Protected dashboard pages
│   ├── dashboard/page.tsx
│   ├── users/page.tsx
│   ├── users/[userId]/page.tsx
│   ├── teams/page.tsx
│   ├── teams/[teamId]/page.tsx
│   ├── profile/page.tsx
│   └── layout.tsx
├── components/                # Reusable UI components
│   ├── Alert.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── index.ts
├── context/                   # React Context for authentication
│   └── AuthContext.tsx
├── lib/                       # Utility functions for backend communication
│   ├── auth.ts
│   └── db.ts
├── utils/                     # API utilities and helpers
│   └── api.ts
├── layout.tsx                 # Root layout with AuthProvider
├── page.tsx                   # Home page (redirects to login/dashboard)
├── globals.css
└── types/
    └── index.ts
```

## Pages

### Authentication Pages

#### Login Page (`app/(auth)/login/page.tsx`)
- Email and password input fields
- Form validation
- Error handling
- Link to registration

#### Register Page (`app/(auth)/register/page.tsx`)
- Full name, email, password inputs
- Optional team code field
- Automatically assigns ADMIN role to first user
- Password confirmation validation

### Dashboard Pages

#### Dashboard (`app/(dashboard)/dashboard/page.tsx`)
- User welcome message
- Quick stats (role, team, email)
- Quick action cards
- Team information display
- Role-based features (admin only sections)

#### Users Management (`app/(dashboard)/users/page.tsx`)
- Displays all users in a table
- Shows name, email, role, team, creation date
- Role badge with color coding
- Refresh functionality

#### User Details (`app/(dashboard)/users/[userId]/page.tsx`) ⚠️ Admin Only
- Individual user profile information
- Change user role functionality
- User activity history
- User ID and timestamps

#### Teams Management (`app/(dashboard)/teams/page.tsx`)
- List all teams in card layout
- Create new team form
- Display team code for joining
- Team creation and management

#### Team Details (`app/(dashboard)/teams/[teamId]/page.tsx`)
- Detailed team information
- Team members list
- Team code (copyable)
- Team statistics

#### User Profile (`app/(dashboard)/profile/page.tsx`)
- Personal profile information
- Edit profile functionality
- Team assignment details
- Profile avatar with initial

## Components

### Core Components

**Button** (`Button.tsx`)
- Props: `variant` (primary, secondary, danger), `size` (sm, md, lg)
- Customizable styling and states

**Input** (`Input.tsx`)
- Label and error message support
- Focus states and validation styling

**Card** (`Card.tsx`)
- Container component with shadow and border
- Consistent spacing

**Alert** (`Alert.tsx`)
- Types: success, error, warning, info
- Auto-colored based on type

**Navbar** (`Navbar.tsx`)
- Navigation with logout functionality
- Mobile responsive menu
- User info display
- Shows current role

**LoadingSpinner** (`LoadingSpinner.tsx`)
- Centered loading animation
- Customizable message

**Modal** (`Modal.tsx`)
- Backdrop with overlay
- Customizable size
- Close button functionality

**ProtectedRoute** (`ProtectedRoute.tsx`)
- Wraps components that require authentication
- Optional role-based access control
- Automatic redirects to login

## Authentication System

### AuthContext (`app/context/AuthContext.tsx`)

Provides global authentication state management:

- **User** object with ID, name, email, role, team info
- **Login** function: authenticates user and stores token
- **Register** function: creates new user account
- **Logout** function: clears authentication
- **getCurrentUser**: fetches current user data
- **isAuthenticated**: boolean flag
- **loading**: boolean for loading states

### Usage Example

```tsx
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  );
}
```

## Middleware

The middleware (`middleware.ts`) handles:
- **Protected Routes**: Redirects unauthenticated users to login
- **Auth Routes**: Redirects authenticated users away from login/register
- **Token Verification**: Validates JWT tokens in cookies

## API Integration

### API Utilities (`app/utils/api.ts`)

```tsx
// Generic API call with credentials
apiCall(url, options)

// Get all users
getUsers()

// Get user by ID
getUserById(userId)

// Update user role
updateUserRole(userId, role)
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key-change-this
BCRYPT_SALT_ROUND=10
DATABASE_URL=postgresql://user:password@localhost:5432/team_management_db
NODE_ENV=development
```

## Styling

Uses **Tailwind CSS 4** with modern utility classes:
- `bg-linear-to-*` for gradients (Tailwind 4 syntax)
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Color system with `-100`, `-600`, `-800` variants
- Consistent spacing and sizing

## Development

### Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## Features

### ✅ Implemented
- User authentication (login, register)
- Protected routes with middleware
- Dashboard with user info
- User management table
- Team management (create, list, view details)
- User profile page
- Responsive design
- Role-based access control
- Error handling and loading states
- Navbar with navigation

### 🚀 Future Enhancements
- User role change interface
- Team member management
- Notifications system
- Settings page
- Dark mode toggle
- Search and filtering
- Pagination for large lists
- User avatar uploads
- Email notifications

## Troubleshooting

### Login redirecting to register?
- Ensure backend API is running
- Check DATABASE_URL in `.env.local`
- Verify JWT_SECRET is set

### Styles not applying?
- Run `npm run dev` to rebuild
- Clear browser cache
- Check Tailwind config in `tailwind.config.ts`

### Protected routes not working?
- Verify middleware.ts exists in root
- Check token in browser cookies
- Ensure AuthProvider wraps app in layout.tsx

## Security Notes

- Tokens stored in httpOnly cookies for XSS protection
- CSRF protection with sameSite cookies
- Email validation on registration
- Password hashing with bcrypt
- No sensitive data in localStorage

## Contributing

When adding new pages or components:
1. Follow the existing folder structure
2. Use the AuthContext for auth state
3. Wrap protected pages with ProtectedRoute component
4. Use reusable components from `/components`
5. Maintain Tailwind CSS conventions

