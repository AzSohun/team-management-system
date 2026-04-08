# Team Management System

A full-stack PERN (PostgreSQL, Express, React, Node.js) application built with Next.js 16, Prisma ORM, and authentication using JWT tokens.

## Tech Stack

- **Frontend**: Next.js 16.2.1, React 19.2.4, Tailwind CSS v4
- **Backend**: Node.js with Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM v7.6.0
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript
- **Linting**: ESLint

## Features

- User authentication (Register/Login)
- Team management
- User roles (ADMIN, LEADER, DEVELOPER, GUIDE)
- Role-based access control
- Protected routes
- User profile management
- Team dashboard
- API routes for CRUD operations

## Prerequisites

- Node.js 20+ (recommended)
- PostgreSQL 12+
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/AzSohun/team-management-system.git
cd team-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/team_management_db?schema=public"
JWT_SECRET="your-secret-key-here-change-in-production"
BCRYPT_SALT_ROUND=11
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: 
- Replace `user:password@localhost:5432/team_management_db` with your PostgreSQL credentials
- Generate a secure JWT_SECRET for production

### 4. Set Up Database

Generate Prisma Client:
```bash
npm run db:generate
```

Push schema to database:
```bash
npm run db:push
```

(Optional) Seed the database:
```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run db:generate  # Generate Prisma Client
npm run db:push   # Push schema changes to database
npm run db:seed   # Seed database with initial data
```

## Project Structure

```
app/
├── (auth)/           # Authentication pages
│   ├── login/
│   └── register/
├── (dashboard)/      # Protected dashboard pages
│   ├── dashboard/
│   ├── profile/
│   ├── teams/
│   └── users/
├── api/              # API routes
│   ├── auth/        # Authentication endpoints
│   ├── team/        # Team management endpoints
│   └── user/        # User management endpoints
├── components/       # Reusable components
├── context/         # React context (Auth, Theme)
├── lib/             # Utility functions (auth, db)
└── types/           # TypeScript types
prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seed script
```

## Database Schema

### User Model
- id (CUID)
- name
- email (unique)
- password (hashed)
- role (ADMIN, LEADER, DEVELOPER, GUIDE)
- teamId (optional)
- createdAt, updatedAt

### Team Model
- id (CUID)
- name (unique)
- description
- code (unique)
- users (array of User)
- createdAt, updatedAt

### Roles Hierarchy
- GUIDE (0) - Lowest permissions
- DEVELOPER (1)
- LEADER (2)
- ADMIN (3) - Highest permissions

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/team` - Get all teams
- `POST /api/team` - Create new team
- `GET /api/team/[teamId]` - Get team details
- `PUT /api/team/[teamId]` - Update team

### Users
- `GET /api/user` - Get all users
- `POST /api/user` - Create user
- `GET /api/user/[userId]` - Get user details
- `PATCH /api/user/[userId]/role` - Update user role
- `PATCH /api/user/[userId]/team` - Assign user to team

## Challenges & Fixes

### 1. **Tailwind CSS v4 Integration**
**Challenge**: Next.js 16 with Turbopack had issues with Tailwind v4's new `@import "tailwindcss"` syntax. PostCSS configuration was failing.

**Fix**: 
- Configured PostCSS to use `@tailwindcss/postcss` plugin
- Updated `postcss.config.mjs` to properly reference the plugin
- Updated `app/globals.css` to import tailwindcss correctly

### 2. **Next.js 16 API Route Parameters**
**Challenge**: API routes using dynamic segments (e.g., `[teamId]`) were using the old parameter syntax which is incompatible with Next.js 16.

**Old Code**:
```typescript
export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: string } }
) {
    const { teamId } = params;
```

**Fix**: Updated to new Promise-based syntax:
```typescript
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ teamId: string }> }
) {
    const { teamId } = await context.params;
```

### 3. **Role Enum Mismatch**
**Challenge**: Code referenced `Role.INTERN` but the Prisma schema only defined `GUIDE`, `DEVELOPER`, `LEADER`, and `ADMIN` roles.

**Fix**: Updated `app/lib/auth.ts` roleHierarchy to use `Role.GUIDE` instead of `Role.INTERN`.

### 4. **Prisma Client Generation**
**Challenge**: During builds, Prisma client wasn't generated before Next.js tried to compile, causing "Cannot find module '@/generated/prisma/client'" errors.

**Fix**: Ensured build command includes Prisma generation first:
```bash
npm install && npx prisma generate && npm run build
```

### 5. **Build Configuration**
**Challenge**: Next.js 16 with Turbopack required proper configuration for CSS processing.

**Fix**: Simplified `postcss.config.mjs` and ensured all dependencies were properly installed and locked.

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs with BCRYPT_SALT_ROUND=11
3. JWT token issued on successful login
4. Token stored in HTTP-only cookie
5. Protected routes verify JWT and user role
6. Role-based access control enforced via `checkUserPermission()` function

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection string | Required |
| JWT_SECRET | Secret key for JWT signing | Required |
| BCRYPT_SALT_ROUND | Bcrypt hashing rounds | 11 |
| NODE_ENV | Environment (development/production) | development |
| NEXT_PUBLIC_API_URL | Frontend API endpoint | http://localhost:3000 |

## Development Notes

### Middleware
The project uses a deprecated middleware convention. Future updates should migrate to the new "proxy" convention as suggested by Next.js warnings.

### TypeScript
Full TypeScript support with strict type checking. All API routes are properly typed.

### Components
Reusable components located in `app/components/`:
- Alert
- Button
- Card
- Input
- LoadingSpinner
- Modal
- Navbar
- ProtectedRoute

## Deployment

### Render Deployment (Free Tier)

1. Create a Render account and PostgreSQL database
2. Connect your GitHub repository
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npm start`
5. Add environment variables (DATABASE_URL, JWT_SECRET, BCRYPT_SALT_ROUND, NODE_ENV)
6. Deploy

### Environment Variables on Render
```
DATABASE_URL: <your-render-postgres-url>
JWT_SECRET: <generate-secure-secret>
BCRYPT_SALT_ROUND: 11
NODE_ENV: production
NEXT_PUBLIC_API_URL: https://your-app.onrender.com
```

## Local Development Tips

1. **Database Issues**: If you get a "connection refused" error, ensure PostgreSQL is running
2. **Port Conflicts**: If port 3000 is in use, Next.js will prompt for an alternative
3. **Hot Reload**: Next.js dev server supports hot reload - changes take effect immediately
4. **Database Changes**: After modifying `prisma/schema.prisma`, run `npm run db:push`

## Troubleshooting

### Build Fails with "Cannot find module '@tailwindcss/postcss'"
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -r .next`
- Rebuild: `npm run build`

### Database Connection Error
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Verify credentials are correct

### API Routes Return 404
- Check that routes are in `app/api/` directory
- Verify file naming convention: `route.ts` (not `index.ts`)
- Ensure proper HTTP method is exported (GET, POST, PATCH, etc.)

### JWT Token Issues
- Ensure JWT_SECRET is set and consistent
- Check token expiration in auth logic
- Verify cookie settings in browser

## License

Private project

## Author

Asad Sohun

---

**Last Updated**: April 7, 2026
