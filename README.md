# Bill Craft

## Bill Craft is a MERN stack application designed for seamless invoice management. Users can create, edit, delete, and share invoices, with authentication powered by JWT and invoice PDFs generated on demand.

### Features

Backend
+ Uses Prisma as the ORM to interact with a PostgreSQL database.
+ Implements JWT authentication with a 1-hour expiry for secure access.
+ Protects /api/auth and /api/invoices routes using JWT verification middleware.
+ Custom Error Handler is implemented using the built-in Error class for meaningful error messages.

Frontend
+ Built with Next.js for fast and efficient rendering.
+ Uses shadcn to maintain a minimalistic and modern UI.
+ Implements Redux for state management.
+ Uses cookies to handle session expiry and automatically logs out users after 1 hour.
+ Invoice Management Features:
+ List all issued invoices
+ Create new invoices for clients
+ Edit & delete invoices
+ Mark invoices as Paid
+ Generate and share a public invoice link
+ When an invoice is accessed via the sharable link, it is converted into a PDF using frontend/app/utils/generateInvoicePDF.ts.

### Running Locally

**Required .env Variables for Backend**
```javascript
PORT=1234
NODE_ENV=CURRENT_RUNNING_ENVIRONEMENT
JWT_SECRET=SOME_STRONG_SECRET
FRONTEND_URL=DEPLOYED_FRONTEND_URL
DATABASE_URL="DATABASE_URL_GOES_HERE"
```

**Required .env Variables for Frontend**
```javascript
NODE_ENV=CURRENT_RUNNING_ENVIRONEMENT
NEXT_PUBLIC_BACKEND_URL=DEPLOYED_BACKEND_URL # append '/api' to match routing
NEXT_PUBLIC_FRONTEND_URL=DEPLOYED_FRONTEND_URL
```

### Install dependencies

**Install backend dependencies**
```
cd ./backend
npm install
```

**Install frontend dependencies**
```
cd ./frontend
npm install
```

__Open in Browser__
Visit http://localhost:3000 to access the application.

