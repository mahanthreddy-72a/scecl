# API Documentation

Base URL: `http://localhost:5000/api`

All responses are JSON. Authenticated endpoints require valid session cookie.

## Authentication

### Admin Login
```
POST /auth/admin/login

Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

### Admin Logout
```
POST /auth/admin/logout

Response:
{
  "success": true
}
```

### Get Admin Status
```
GET /auth/admin/status

Response:
{
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

### Student Login
```
POST /auth/student/login

Request:
{
  "scs_no": "1001"
}

Response:
{
  "success": true,
  "student": {
    "id": 1,
    "name": "Alice Johnson",
    "scs_no": "1001",
    "class": "10A",
    "house": "Spartans"
  }
}

Errors:
- 404: Student not found
- 403: You have already voted
```

### Student Logout
```
POST /auth/student/logout

Response:
{
  "success": true
}
```

### Get Student Status
```
GET /auth/student/status

Response:
{
  "student": {
    "id": 1,
    "name": "Alice Johnson",
    "scs_no": "1001",
    "class": "10A",
    "house": "Spartans",
    "has_voted": 0
  }
}
```

## Voting

### Get Available Positions
```
GET /voting/positions

Response:
{
  "positions": [
    {
      "name": "Head Boy",
      "common": true
    },
    {
      "name": "Head Girl",
      "common": true
    },
    {
      "name": "Sports Captain",
      "common": true
    },
    {
      "name": "Cultural Secretary",
      "common": true
    },
    {
      "name": "House Captain",
      "common": false,
      "house": "Spartans"
    },
    {
      "name": "House Vice Captain",
      "common": false,
      "house": "Spartans"
    }
  ]
}
```

### Get Candidates for Position
```
GET /voting/candidates/:position

Example: /voting/candidates/Head%20Boy

Response:
{
  "candidates": [
    {
      "id": 1,
      "name": "Arun Kumar",
      "position": "Head Boy",
      "house": null,
      "image_path": "/uploads/candidates/photo.jpg"
    }
  ]
}
```

### Submit Votes
```
POST /voting/submit

Request:
{
  "votes": [
    {
      "position": "Head Boy",
      "candidateId": 1
    },
    {
      "position": "Head Girl",
      "candidateId": 2
    },
    {
      "position": "Sports Captain",
      "candidateId": 3
    },
    {
      "position": "Cultural Secretary",
      "candidateId": 4
    },
    {
      "position": "House Captain",
      "candidateId": 5
    },
    {
      "position": "House Vice Captain",
      "candidateId": 6
    }
  ]
}

Response:
{
  "success": true,
  "message": "Your votes have been submitted successfully"
}

Errors:
- 400: No votes provided / Invalid vote data / Invalid position
- 403: You have already voted
```

### Log Activity
```
POST /voting/activity

Request:
{
  "status": "logged_in" | "viewing_ballot" | "voting" | "submitted"
}

Response:
{
  "success": true
}
```

## Candidates (Admin Only)

### List All Candidates
```
GET /candidates

Response:
{
  "candidates": [
    {
      "id": 1,
      "name": "Arun Kumar",
      "position": "Head Boy",
      "house": null,
      "image_path": "/uploads/candidates/photo.jpg",
      "vote_count": 42,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Candidate by ID
```
GET /candidates/:id

Response:
{
  "candidate": {
    "id": 1,
    "name": "Arun Kumar",
    "position": "Head Boy",
    "house": null,
    "image_path": "/uploads/candidates/photo.jpg",
    "vote_count": 42
  }
}
```

### Create Candidate
```
POST /candidates

Headers:
Content-Type: multipart/form-data

Fields:
- name (string, required)
- position (string, required) - Head Boy | Head Girl | Sports Captain | Cultural Secretary | House Captain | House Vice Captain
- house (string, optional) - Spartans | Vikings | Knights | Samurais
- image (file, optional) - JPEG, PNG, GIF

Response:
{
  "success": true,
  "candidate": {
    "id": 1,
    "name": "Arun Kumar",
    "position": "Head Boy",
    "house": null,
    "image_path": "/uploads/candidates/photo.jpg"
  }
}
```

### Update Candidate
```
PUT /candidates/:id

Headers:
Content-Type: multipart/form-data

Fields: (same as create, all optional)

Response:
{
  "success": true,
  "candidate": { ... }
}
```

### Delete Candidate
```
DELETE /candidates/:id

Response:
{
  "success": true,
  "message": "Candidate deleted"
}
```

## Students (Admin Only)

### List Students
```
GET /students?page=1&limit=20&search=

Query Parameters:
- page (number, default: 1)
- limit (number, default: 20)
- search (string, optional) - searches scs_no, name, class

Response:
{
  "students": [
    {
      "id": 1,
      "scs_no": "1001",
      "name": "Alice Johnson",
      "class": "10A",
      "house": "Spartans",
      "has_voted": 0,
      "last_login": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "pages": 50
  }
}
```

### Get Student by ID
```
GET /students/:id

Response:
{
  "student": {
    "id": 1,
    "scs_no": "1001",
    "name": "Alice Johnson",
    "class": "10A",
    "house": "Spartans",
    "has_voted": 0,
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

### Create Student
```
POST /students

Request:
{
  "scs_no": "1001",
  "name": "Alice Johnson",
  "class": "10A",
  "house": "Spartans"
}

Response:
{
  "success": true,
  "student": { ... }
}

Errors:
- 400: Duplicate SCS number
```

### Update Student
```
PUT /students/:id

Request: (all fields optional)
{
  "name": "Alice Johnson",
  "class": "10A",
  "house": "Spartans"
}

Response:
{
  "success": true,
  "student": { ... }
}
```

### Delete Student
```
DELETE /students/:id

Response:
{
  "success": true,
  "message": "Student deleted"
}
```

### Bulk Import Students
```
POST /students/import/bulk

Headers:
Content-Type: multipart/form-data

Fields:
- file (file, required) - CSV or XLSX

CSV Format:
scs_no,name,class,house
1001,Alice Johnson,10A,Spartans
1002,Bob Smith,10B,Vikings

Response:
{
  "success": true,
  "message": "Imported 100 students, skipped 5",
  "imported": 100,
  "skipped": 5
}
```

## Dashboard (Admin Only)

### Get Election Statistics
```
GET /dashboard/stats

Response:
{
  "stats": {
    "totalStudents": 1000,
    "votesCast": 750,
    "studentsVoted": 750,
    "remainingStudents": 250,
    "participationPercentage": 75
  }
}
```

### Get Activity Logs
```
GET /dashboard/activity?limit=50

Query Parameters:
- limit (number, default: 50)

Response:
{
  "activityLogs": [
    {
      "id": 1,
      "student_id": 1,
      "status": "logged_in",
      "created_at": "2024-01-15T10:30:00Z",
      "name": "Alice Johnson",
      "scs_no": "1001"
    }
  ]
}
```

### Get Election Results
```
GET /dashboard/results

Response:
{
  "results": {
    "Head Boy": [
      {
        "id": 1,
        "name": "Arun Kumar",
        "position": "Head Boy",
        "house": null,
        "votes": 342
      }
    ],
    "Head Girl": [ ... ],
    "Sports Captain": [ ... ],
    ...
  }
}
```

### Get Results for Position
```
GET /dashboard/results/position/:position

Example: /dashboard/results/position/Head%20Boy

Response:
{
  "position": "Head Boy",
  "results": [
    {
      "id": 1,
      "name": "Arun Kumar",
      "position": "Head Boy",
      "house": null,
      "votes": 342
    }
  ]
}
```

### Get Results by House
```
GET /dashboard/results/house

Response:
{
  "houseResults": {
    "Spartans": [
      {
        "id": 5,
        "name": "Spartan Captain",
        "position": "House Captain",
        "house": "Spartans",
        "votes": 120
      }
    ],
    "Vikings": [ ... ],
    "Knights": [ ... ],
    "Samurais": [ ... ]
  }
}
```

### Get Participation by Class
```
GET /dashboard/participation/class

Response:
{
  "results": [
    {
      "class": "10A",
      "total": 50,
      "voted": 45,
      "percentage": 90.0
    }
  ]
}
```

### Get Participation by House
```
GET /dashboard/participation/house

Response:
{
  "results": [
    {
      "house": "Spartans",
      "total": 250,
      "voted": 200,
      "percentage": 80.0
    }
  ]
}
```

### Get Current Activity
```
GET /dashboard/activity/current

Response:
{
  "activity": {
    "logged_in": 5,
    "viewing_ballot": 3,
    "voting": 2,
    "submitted": 50
  }
}
```

## Health Check

```
GET /health

Response:
{
  "status": "ok"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (already voted, etc)
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

- Global: 100 requests per IP per 15 minutes
- Applied to all endpoints

## Authentication Notes

- Sessions are stored in SQLite
- Session cookies are HTTP-only and Secure (in production)
- Session duration: 24 hours
- Credentials in all subsequent requests via cookies
