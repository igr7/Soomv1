# Soom Gaming - Saudi Gaming Marketplace

A production-ready iOS gaming marketplace built with React Native (Expo) and Node.js. Secure buying/selling of gaming accounts and items through an escrow-based auction system.

## ✅ Current Status: Phase 2 Complete

**Phase 1**: Foundation architecture ✓
**Phase 2**: JWT Authentication system ✓
**Phase 3**: Listings & Auctions (Next)

## 🎯 Architecture

### Architecture

```
soomv1/
├── server/                    # Node.js Backend
│   ├── prisma/
│   │   └── schema.prisma     # Database schema (5 models)
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── services/         # Business logic
│   │   └── index.js          # Express app entry
│   ├── package.json
│   └── .env.example
├── app/                       # Expo Router screens
├── components/                # Reusable React Native components
├── constants/                 # Theme, colors, config
└── Configuration files
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Server runs on http://localhost:3000

### 2. Frontend Setup

```bash
npm install
cp .env.example .env
# Edit .env with your API URL (use your computer's IP for physical devices)
npx expo start
```

Scan QR code with Expo Go app to preview.

### 3. Test Authentication

- Open app → redirects to login
- Click "Register" to create account
- Fill form with valid credentials
- Should redirect to home screen showing user info
- Test logout and login again

## 📦 Database Schema

- **Users**: Authentication, wallet balance, roles
- **Listings**: Gaming accounts/items for auction
- **Bids**: Auction bidding system
- **Transactions**: Escrow and wallet operations
- **Images**: Listing media

## 🎨 Design System

- **Theme**: Dark luxury with neon green (#00FF41) accents
- **Styling**: NativeWind (Tailwind for React Native)
- **RTL**: Arabic language support configured

## 🔧 Tech Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon for production)
- JWT authentication (Phase 2)
- bcrypt password hashing (Phase 2)

### Frontend
- React Native (Expo SDK 52)
- Expo Router (file-based routing)
- NativeWind (Tailwind CSS)
- TypeScript

## 📝 Environment Variables

**Backend** (`server/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/soomgaming"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:8081,exp://192.168.1.1:8081"
```

**Frontend** (`.env`):
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
# For physical device: http://YOUR_COMPUTER_IP:3000
```

## 🗄️ Database Setup

### Local Development
Install PostgreSQL locally or use Docker:

```bash
docker run --name soom-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Production (Recommended)
Use Neon (neon.tech) - 10GB free tier, serverless PostgreSQL:
1. Create account at neon.tech
2. Create new project
3. Copy connection string to DATABASE_URL

## 📋 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

### Frontend
- `npm start` - Start Expo dev server
- `npm run android` - Open on Android
- `npm run ios` - Open on iOS
- `npm run web` - Open in web browser

## ✅ API Endpoints

### Authentication (Phase 2 ✓)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Health Check
- `GET /health` - Server health status

See [PHASE2.md](./PHASE2.md) for detailed API documentation and testing examples.

## 🔐 Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **JWT Tokens**: Access (15min) + Refresh (7d) tokens
- **Input Validation**: Username, email, password strength requirements
- **Protected Routes**: Middleware-based authentication
- **Token Refresh**: Automatic token renewal mechanism

## 🔜 Next Phase

Phase 3 will implement:
- Listing creation and management
- Image upload functionality
- Auction bidding system
- Escrow transaction logic
- Wallet deposit/withdrawal
- Admin dashboard

## 📄 License

ISC
