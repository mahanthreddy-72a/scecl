# School Elections System - Developer Guide

## Project Overview

This is a full-stack school election management system built for student council elections at a school with ~1000+ students. Students vote using their unique SCS number, with house-specific voting positions.

## Architecture

### Backend (Node.js/Express)
- RESTful API with session-based authentication
- SQLite database with WAL mode for concurrency
- Transactional voting to prevent double-voting
- Comprehensive audit logging
- File uploads for candidate photos

### Frontend (React)
- Dark-themed responsive UI
- Student voting flow (login → confirm → ballot → success)
- Admin dashboard with real-time statistics
- Mobile-friendly design

## Key Design Decisions

1. **SQLite for Simplicity**: Perfect for school LAN deployment, no external dependencies
2. **Session-Based Auth**: Prevents double voting within same session
3. **Atomic Transactions**: Vote submission is all-or-nothing
4. **Dual-mode UI**: Separate student and admin interfaces
5. **File Storage**: Candidate photos stored on disk, not in database

## Database Design

- `students`: Core student data with vote tracking
- `candidates`: Candidate profiles with vote counts
- `votes`: Immutable vote records (audit trail)
- `admins`: Admin accounts with password hashes
- `audit_logs`: Action logging for compliance
- `activity_logs`: Real-time user activity tracking

**Key constraint**: `students.has_voted` = 1 after submission, prevents re-voting

## API Patterns

All endpoints return JSON:
```json
{
  "success": true,
  "data": {},
  "error": "optional error message"
}
```

Protected endpoints require session authentication:
- Admin routes: `requireAdmin` middleware
- Student routes: `requireStudent` middleware

## Common Tasks

### Adding a New Admin Feature

1. Create controller method in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Create frontend page in `frontend/src/pages/`
4. Add API call in `frontend/src/utils/api.js`
5. Update admin navigation in nav components

### Modifying Student Voting Flow

1. Update positions in `votingController.js` (backend)
2. Update `StudentBallot.jsx` to reflect changes
3. Ensure house-specific logic is maintained

### Adding Database Schema Changes

1. Create new migration in `backend/src/migrations/`
2. Update `run.js` to execute migration
3. Update seed script if needed
4. Update corresponding models/controllers

## File Organization

```
backend/src/
├── index.js           - Express server entry
├── db.js              - Database connection
├── controllers/       - Business logic
├── routes/            - API endpoints
├── middleware/        - Auth, error handling
├── utils/             - Auth, audit logging
├── migrations/        - Schema management
└── seeds/             - Test data

frontend/src/
├── main.jsx           - React entry
├── App.jsx            - Routing
├── pages/             - Full-page components
├── components/        - Reusable components
├── hooks/             - Custom hooks (useAuth)
├── utils/             - API client (api.js)
└── index.css          - Tailwind styles
```

## Security Considerations

1. **Vote Integrity**: 
   - Database constraint prevents duplicate votes
   - Server validates before recording
   - Transactional submission

2. **Authentication**:
   - Bcrypt for admin passwords
   - Session-based for students (prevents session fixation)
   - CORS configured for origin

3. **Input Validation**:
   - Server-side validation required
   - Type checking on all inputs
   - Position/house enum validation

4. **Audit Trail**:
   - Every action logged
   - Vote records immutable
   - Activity logs for monitoring

## Testing the System

### Manual Test Flow

1. **Student Voting**:
   - Navigate to `/`
   - Enter SCS number (try 1001-1030 after seeding)
   - Confirm identity
   - Vote for all positions
   - See success message

2. **Admin Functions**:
   - Go to `/admin/login`
   - Use credentials: `admin` / `admin123`
   - Add candidates
   - Bulk import students
   - View real-time results

### Test Data

After running `npm run db:seed`, system has:
- 30 students (SCS 1001-1030)
- 4 common position candidates
- 8 house-position candidates (2 per house)

## Performance Notes

- **Concurrency**: SQLite WAL mode handles ~100-200 simultaneous writers
- **Scalability**: Works well for 1000+ students
- **Query Optimization**: Indexed on `scs_no`, `has_voted`, `position`
- **Transaction Size**: Vote submission is small, fast transaction

## Deployment Checklist

- [ ] Change admin password from default `admin123`
- [ ] Set `SESSION_SECRET` environment variable
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origin to school domain
- [ ] Back up database daily
- [ ] Test complete voting flow before election
- [ ] Brief admins on dashboard usage
- [ ] Set up monitoring/alerts

## Common Issues & Solutions

**Issue**: Students can't login
- Check SCS number format (should be string)
- Verify student exists in database
- Check session is active

**Issue**: Double voting attempts
- Backend prevents via `has_voted` check
- Student sees "You have already voted" error
- Vote records show in audit logs

**Issue**: Photos not uploading
- Check file size limits (10MB max)
- Verify MIME type is image/*
- Check uploads directory permissions

**Issue**: Database locked
- Kill any stray processes
- Delete `.db-wal` and `.db-shm` files
- Restart server

## Future Enhancements

- WebSocket for real-time admin updates
- Email notifications for votes
- Voter verification with QR codes
- Multi-language support
- Mobile app version
- Vote result announcements dashboard
- Student feedback system

## Development Workflow

1. Make changes locally
2. Test on `localhost:3000` (frontend) and `localhost:5000` (backend)
3. Run database migrations if needed
4. Test complete flow end-to-end
5. Commit with descriptive message

## Code Style

- Frontend: Use functional components, hooks, no class components
- Backend: Controllers handle business logic, routes handle HTTP
- Database: Use prepared statements always
- Comments: Only for WHY, not WHAT

## Contact & Support

Questions about the codebase? Check CLAUDE.md or README.md first.
