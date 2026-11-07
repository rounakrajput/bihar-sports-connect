# Bihar Sports Connect

Stack (as per the SRS): React (Vite) + Node.js/Express + MySQL.

## Setup

### 1. Database
Open MySQL Workbench, run `database/schema.sql`.

### 2. Server
```
cd server
cp .env.example .env      # Windows: copy .env.example .env  (then set DB_PASSWORD and JWT_SECRET)
npm install
npm run seed              # creates one demo user per role
npm run dev               # http://localhost:5000
```
Check http://localhost:5000/api/health, it should say `"database":"connected"`.

### 3. Client
```
cd client
npm install
npm run dev               # http://localhost:5173
```

## Demo accounts
| Role | Email | Password |
|---|---|---|
| Athlete | athlete@demo.com | Athlete@123 |
| Organization | org@demo.com | Org@12345 |
| Administrator | admin@demo.com | Admin@123 |
