# School Election Management System

A complete full-stack election management system designed for school student council elections.

## Features

- **Student Voting**: Secure student login with SCS number authentication
- **Duplicate Vote Prevention**: Prevents students from voting multiple times
- **House-Specific Voting**: Support for house-specific and school-wide positions
- **Admin Panel**: Comprehensive admin dashboard for managing elections
- **Candidate Management**: Add, edit, and delete candidates with photo uploads
- **Student Management**: Manage student database with bulk import (CSV/Excel)
- **Live Analytics**: Real-time election statistics and participation tracking
- **Results Dashboard**: Detailed election results with charts and breakdowns
- **Dark Theme UI**: Modern, responsive dark-themed interface
- **Mobile Friendly**: Fully responsive design for mobile devices

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- SQLite 3 (better-sqlite3)
- Bcrypt (password hashing)
- Multer (file uploads)

### Database
- SQLite with WAL mode for concurrency
- Comprehensive schema with audit logging

## Project Structure

```
elections/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # API utilities
│   │   └── styles/       # CSS files
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/              # Express server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   ├── utils/        # Utility functions
│   │   ├── migrations/   # Database schema
│   │   ├── seeds/        # Test data
│   │   └── index.js      # Server entry point
│   └── package.json
├── database/             # SQLite database files
├── uploads/              # User uploads (candidate photos)
└── docs/                # Documentation

```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Initialize the database:
```bash
npm run db:migrate
```

3. Seed test data (optional):
```bash
npm run db:seed
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Student Flow

1. **Landing Page**: Enter your SCS number
2. **Confirmation**: Verify your identity (name, class, house)
3. **Voting**: Vote for candidates in assigned positions
4. **Success**: Confirmation of vote submission

### Admin Flow

1. **Login**: Access admin panel with credentials
2. **Dashboard**: View real-time election statistics
3. **Candidates**: Add, edit, and manage candidates
4. **Students**: Manage student database and bulk import
5. **Results**: View detailed election results and analytics

## Admin Credentials

Default admin account (after seed):
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these in production!**

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/logout` - Admin logout
- `GET /api/auth/admin/status` - Check admin auth status
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/student/logout` - Student logout
- `GET /api/auth/student/status` - Check student auth status

### Voting
- `GET /api/voting/positions` - Get available positions
- `GET /api/voting/candidates/:position` - Get candidates for position
- `POST /api/voting/submit` - Submit votes
- `POST /api/voting/activity` - Log activity status

### Candidates (Admin only)
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create candidate (with image)
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Students (Admin only)
- `GET /api/students` - List students (paginated, searchable)
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/import/bulk` - Bulk import from CSV/Excel

### Dashboard (Admin only)
- `GET /api/dashboard/stats` - Election statistics
- `GET /api/dashboard/activity` - Activity logs
- `GET /api/dashboard/results` - Election results
- `GET /api/dashboard/results/position/:position` - Results for position
- `GET /api/dashboard/results/house` - Results by house
- `GET /api/dashboard/participation/class` - Participation by class
- `GET /api/dashboard/participation/house` - Participation by house
- `GET /api/dashboard/activity/current` - Current activity status

## Database Schema

### students
- `id` - Primary key
- `scs_no` - Unique SCS number
- `name` - Student name
- `class` - Class/grade
- `house` - House assignment
- `has_voted` - Vote status
- `last_login` - Timestamp
- `created_at`, `updated_at` - Timestamps

### candidates
- `id` - Primary key
- `name` - Candidate name
- `position` - Election position
- `house` - House (null for school-wide)
- `image_path` - Photo path
- `vote_count` - Vote total
- `created_at`, `updated_at` - Timestamps

### votes
- `id` - Primary key
- `student_id` - Foreign key to students
- `candidate_id` - Foreign key to candidates
- `position` - Position voted for
- `created_at` - Timestamp

### admins
- `id` - Primary key
- `username` - Admin username
- `password_hash` - Bcrypt hash
- `email` - Admin email
- `created_at`, `updated_at` - Timestamps

### audit_logs
- `id` - Primary key
- `action` - Action performed
- `entity_type` - Entity type
- `entity_id` - Entity ID
- `details` - JSON details
- `created_at` - Timestamp

### activity_logs
- `id` - Primary key
- `student_id` - Foreign key
- `status` - Activity status
- `created_at` - Timestamp

## Positions

### School-wide Positions
- Head Boy
- Head Girl
- Sports Captain
- Cultural Secretary

### House-Specific Positions
- House Captain (per house)
- House Vice Captain (per house)

## Houses
- Spartans
- Vikings
- Knights
- Samurais

## Security Features

- Session-based authentication
- Password hashing with Bcrypt
- Duplicate vote prevention at database level
- CSRF protection via session management
- Server-side vote validation
- Input sanitization
- Rate limiting on API endpoints
- Audit logging for all actions
- Foreign key constraints for data integrity

## Deployment

### On School LAN

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Serve frontend as static files from backend or separate server

3. Deploy backend to school server:
```bash
# Copy files to server
# Install dependencies
npm install
# Run migrations
npm run db:migrate
# Start server
npm start
```

4. Access via: `http://[server-ip]:3000` (or configured port)

## Environment Variables

Create `.env` in backend directory:

```
PORT=5000
SESSION_SECRET=your-secret-key-here
NODE_ENV=production
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Locked
SQLite uses WAL mode. If locked:
```bash
# Delete WAL files
rm database/elections.db-wal
rm database/elections.db-shm
```

### Session Issues
Clear browser cookies and localStorage, then refresh

## Development

### Running Tests

Currently no tests configured. To add:
```bash
npm install --save-dev jest @testing-library/react
```

### Adding New Features

1. Backend: Add route → controller → database changes
2. Frontend: Add page/component → hook → API call
3. Database: Create migration for schema changes
4. Audit log important actions

## Performance Notes

- SQLite with WAL mode handles ~1000+ concurrent users
- Voting is atomic transaction (all-or-nothing)
- Indexes on frequently queried columns
- Session storage in SQLite for persistence

## Support

For issues or questions, contact the election administrator.

## License

Internal use only - School Elections System
