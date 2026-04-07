# Frontend Setup & Quick Start Guide

## Prerequisites

- Node.js 18+ and npm/yarn installed
- PostgreSQL database running
- Backend API running on `http://localhost:3000/api`

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   
   Copy `.env.example` to `.env.local` and update values:
   ```bash
   cp .env.example .env.local
   ```
   
   Update these values in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-key-change-this-in-production
   BCRYPT_SALT_ROUND=10
   DATABASE_URL=postgresql://user:password@localhost:5432/team_management_db
   NODE_ENV=development
   ```

3. **Setup Database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed database
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend is available at `http://localhost:3000`

## Testing the Frontend

### 1. Create First Account
1. Go to `http://localhost:3000/register`
2. Create account with any email/password
3. You'll automatically be assigned **ADMIN** role (since you're the first user)

### 2. Login
1. Go to `http://localhost:3000/login`
2. Enter your credentials
3. You'll be redirected to the dashboard

### 3. Explore Features
- **Dashboard**: View your profile and quick statistics
- **Users**: See all registered users and their roles
- **Teams**: Create and manage teams
- **Profile**: Edit your personal information

### 4. Create Test Data
1. Go to `/teams`
2. Click "+ New Team"
3. Fill in team name and description
4. Share the team code with others to join

## User Roles

System supports four roles with different permissions:

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all features, user management |
| **LEADER** | Team management, team member oversight |
| **GUIDE** | Educational/mentoring access |
| **DEVELOPER** | Base user level access |

> **Note**: First registered user automatically gets ADMIN role. Subsequent users get DEVELOPER role.

## Folder Structure Quick Reference

```
app/
├── (auth)/           → Login, Register pages
├── (dashboard)/      → Protected dashboard pages
├── components/       → Reusable UI components
├── context/          → Auth state management
├── lib/              → Database and auth utilities
├── utils/            → API utilities
└── types/            → TypeScript interfaces
```

## Common URLs

| Page | URL | Auth Required |
|------|-----|---------------|
| Login | `/login` | ❌ No |
| Register | `/register` | ❌ No |
| Dashboard | `/dashboard` | ✅ Yes |
| Users | `/users` | ✅ Yes |
| Teams | `/teams` | ✅ Yes |
| Profile | `/profile` | ✅ Yes |

## Component Usage Examples

### Using AuthContext
```tsx
import { useAuth } from '@/app/context/AuthContext';

function Component() {
  const { user, login, logout } = useAuth();
  
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      Welcome {user.name}!
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Using API Utilities
```tsx
import { getUsers, getUserById } from '@/app/utils/api';

async function fetchUserData() {
  try {
    const allUsers = await getUsers();
    const user = await getUserById('userId123');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Using Components
```tsx
import { Button, Input, Card, Alert } from '@/app/components';

export default function Form() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <Card>
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {error && <Alert type="error" message={error} />}
    </Card>
  );
}
```

## Development Tips

### Hot Reload
Changes are automatically reflected in the browser during development.

### TypeScript
Full TypeScript support. Check types in `/app/types/index.ts`.

### Styling
Use Tailwind CSS utility classes. No need for CSS files!

### Debugging
- Browser DevTools: Inspect state and network requests
- Console: All API responses logged
- Network tab: Monitor API calls

## Build for Production

```bash
# Create optimized build
npm run build

# Test production build
npm run start
```

Production bundle is created in the `.next/` folder.

## Deployment

### Deployment Checklist
- [ ] `.env.local` configured with production values
- [ ] Database URL points to production database
- [ ] JWT_SECRET is a strong, random string
- [ ] Backend API URL is correct
- [ ] All tests passing
- [ ] Build completed successfully

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
This is a standard Next.js app, so it works with:
- Netlify
- AWS Amplify
- Heroku
- Digital Ocean
- Any Node.js host

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Restart PostgreSQL
# Ensure database exists
```

### Token Errors
```bash
# Clear browser cookies and login again
# Check JWT_SECRET matches backend
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **React**: https://react.dev

## Next Steps

1. ✅ Frontend is now complete
2. 🔄 Ensure backend API is running
3. 📱 Test all pages and features
4. 🚀 Deploy to production when ready

---

**Happy coding! 🎉**
