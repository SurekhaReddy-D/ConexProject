# Quick Start Guide

## How to Run the Project

### Step 1: Install Dependencies

**Root (Backend):**
```bash
npm install
```

**Client (Frontend):**
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-client
```

### Step 2: Set Up Environment

**Root `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/connex
JWT_SECRET=your-secret-key-12345
PORT=5000
NODE_ENV=development
```

**Client `.env` file (already created):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### Step 4: Run the Application

**Option 1: Run both together (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
npm start
```

Terminal 2 - Frontend:
```bash
npm run client
```

### Step 5: View the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the Sample Page

The client has a sample page that fetches users from `/api/users`. 

**Note:** This endpoint requires authentication. To test:

1. First, register a user via the API:
   ```bash
   POST http://localhost:5000/api/auth/register
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "member",
     "department": "Engineering"
   }
   ```

2. Login to get a token:
   ```bash
   POST http://localhost:5000/api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. The sample page will show users once you have authentication set up.

## Troubleshooting

- **Port 3000 already in use**: Kill the process or change the port
- **MongoDB connection error**: Check your `.env` MONGODB_URI
- **Module not found**: Run `npm install` in both root and client folders
- **API errors**: Make sure backend is running on port 5000
