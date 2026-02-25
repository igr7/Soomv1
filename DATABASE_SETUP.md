# Database Setup Instructions

## Current Issue
The database hostname `gr7-2y0ioo.sa-1.cranl.app` is not resolving in DNS. This typically means:
- Database is still being provisioned
- Hostname is incorrect
- Network/firewall blocking access

## When Database is Ready

### 1. Verify Connection String
Check your database provider dashboard for:
- Database status (should be "Running" or "Active")
- Correct connection string
- Any IP whitelist requirements

### 2. Run Migrations
Once the database is accessible:

```bash
cd server
npx prisma migrate dev --name init
```

This will create all 5 tables:
- Users (authentication, wallet)
- Listings (gaming items/accounts)
- Bids (auction system)
- Transactions (escrow, payments)
- Images (listing photos)

### 3. Verify Database Setup
```bash
npx prisma studio
```

Opens a GUI to view your database tables.

### 4. Test Authentication
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## Alternative: Use Neon (Free Tier)

If the current database continues to have issues:

1. Go to https://neon.tech
2. Sign up (free, no credit card)
3. Create new project
4. Copy connection string
5. Update `server/.env` with new DATABASE_URL
6. Run migrations

Neon provides:
- 10GB free storage
- Serverless PostgreSQL
- Instant provisioning
- Saudi Arabia region available
