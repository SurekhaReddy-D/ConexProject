# Connex - Full-Stack Project Management Application

A modern full-stack project management application built with React frontend and Node.js/Express backend with MongoDB database.

## Features

- **User Authentication**: Register, login, and user management
- **Project Management**: Create, update, and track projects
- **Task Management**: Assign tasks, track progress, and manage deadlines
- **Meeting Management**: Schedule meetings, track attendance, and manage meeting history
- **Team Collaboration**: View team members, their profiles, and contact information
- **Activity Timeline**: Track all activities and progress across projects
- **Real-time Updates**: Dynamic data fetching from backend APIs

## Tech Stack

### Frontend
- React 18.2
- Tailwind CSS
- React Scripts

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HACKATHON
   ```

2. **Install dependencies**
   
   Install root dependencies:
   ```bash
   npm install
   ```
   
   Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```
   
   Or use the convenience script:
   ```bash
   npm run install-client
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (for backend):
   ```env
   MONGODB_URI=mongodb://localhost:27017/connex
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```
   
   The client folder already has a `.env` file with:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

5. **Run the application**

   For development (runs both frontend and backend):
   ```bash
   npm run dev
   ```

   Or run separately:
   
   Backend only:
   ```bash
   npm run server
   ```
   
   Frontend only (from root):
   ```bash
   npm run client
   ```
   
   Or from client folder:
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/project/:projectId` - Get users by project

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Tasks
- `GET /api/tasks` - Get all tasks (supports query params: projectId, assignedTo, status)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/project/:projectId` - Get tasks by project
- `GET /api/tasks/user/:userId` - Get tasks by user

### Meetings
- `GET /api/meetings` - Get all meetings (supports query params: status, type, projectId)
- `GET /api/meetings/:id` - Get meeting by ID
- `POST /api/meetings` - Create meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `POST /api/meetings/:id/join` - Join meeting
- `GET /api/meetings/status/ongoing` - Get ongoing meetings
- `GET /api/meetings/status/upcoming` - Get upcoming meetings
- `GET /api/meetings/status/history` - Get meeting history

### Actions
- `GET /api/actions` - Get all actions (supports query params: projectId, userId, type, department)
- `GET /api/actions/:id` - Get action by ID
- `POST /api/actions` - Create action
- `GET /api/actions/recent/timeline` - Get recent actions for timeline

## Database Schema

### User
- name, email, password, role, department
- contact (email, discord, linkedin, phone, github)
- skills, bio, teams, joinDate, avatar

### Project
- name, description, status, priority
- members (User references), tasks (Task references)
- startDate, endDate, dueDate, budget, progress
- createdBy (User reference)

### Task
- name, title, description, status, priority, category
- assignedTo (User reference), projectId (Project reference)
- deadline, completionDate, relatedDocs
- createdBy (User reference)

### Meeting
- name, description, type, status
- time, duration, location
- host (User reference), joinedMembers (User references)
- agenda, hasDocument, hasRecording
- projectId (Project reference)

### Action
- type, title, description
- user (User reference), projectId, taskId, meetingId
- priority, department
- hasDocument, hasMeeting, hasGitHub
- members (User references), metadata

## Project Structure

```
HACKATHON/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
├── client/              # React frontend
│   ├── public/          # Public assets
│   ├── src/            # React source code
│   │   ├── App.js      # Main App component
│   │   └── index.js    # Entry point
│   ├── package.json    # Client dependencies
│   └── .env            # Client environment variables
├── server.js           # Express server
├── package.json        # Root dependencies
└── README.md          # This file
```

## Development

### Adding New Features

1. Create/update models in `backend/models/`
2. Create/update routes in `backend/routes/`
3. Update API services in `src/services/api.js`
4. Update React components in `src/views/` or `src/components/`

### Environment Variables

Make sure to set up your `.env` file with proper values:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string in production)
- `PORT`: Backend server port (default: 5000)
- `REACT_APP_API_URL`: Frontend API base URL

## Production Deployment

1. Build the React app:
   ```bash
   npm run build
   ```
   
   This will build the client app into `client/build/`

2. Set `NODE_ENV=production` in your `.env` file

3. The server will serve the built React app automatically when `NODE_ENV=production`

## License

ISC

## Author

Your Name
