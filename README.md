# B2B Social Network

A comprehensive professional social networking platform exclusively for companies and businesses to connect, collaborate, share opportunities, post jobs, and gain insights through analytics.

## 🌐 Multilingual Support

This website supports **both Arabic and English** languages with full RTL (Right-to-Left) layout support for Arabic users. Switch between languages seamlessly using the professional language toggle in the navigation bar.

- **English (EN)** - Full platform experience in English
- **العربية (AR)** - Complete Arabic translation with RTL layout

## Features

- **Company Profiles & Authentication** - Secure registration and login for businesses
- **Business Feed & Posts** - Share updates and news with your network
- **Company Connections** - Build professional relationships with other businesses
- **Direct Messaging** - Private conversations between companies
- **Job Postings** - B2B hiring and recruitment
- **Analytics Dashboard** - Track profile views, engagement, and growth
- **Notifications** - Real-time alerts for important activities
- **Events Management** - Create and register for business events
- **Groups & Communities** - Industry-specific networking groups
- **Reviews & Ratings** - Build reputation through peer reviews
- **File Sharing** - Upload and share documents
- **Company Verification/Badges** - Earn and display achievement badges
- **Global Search** - Search across all platform content
- **Admin Dashboard** - Complete system management for owners

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React 18 + React Router v6 + Axios
- **Authentication**: JWT tokens
- **Styling**: Custom CSS

## Project Structure

```
b2b-social-network/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py
│   │   ├── schemas/
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   └── auth.py
│   │   └── routers/
│   │       ├── auth.py
│   │       └── api.py
│   ├── requirements.txt
│   └── Dockerfile (optional)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── FeedPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── ConnectionsPage.js
│   │   │   ├── MessagesPage.js
│   │   │   ├── JobsPage.js
│   │   │   ├── EventsPage.js
│   │   │   ├── GroupsPage.js
│   │   │   ├── SearchPage.js
│   │   │   └── AdminPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── Dockerfile (optional)
├── docker-compose.yml (optional)
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd b2b-social-network/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. The API will be available at http://localhost:8000
   - API documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd b2b-social-network/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The app will be available at http://localhost:3000

### First Steps

1. Open http://localhost:3000 in your browser
2. Click "Register" to create a company account
3. Fill in company details and user information
4. After registration, you'll be redirected to the dashboard
5. Start exploring features: create posts, search for companies, send connection requests, etc.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new company
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current company

### Companies
- `GET /api/v1/companies` - List all companies
- `GET /api/v1/companies/{id}` - Get company profile
- `PUT /api/v1/companies/{id}` - Update company profile

### Posts
- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post
- `DELETE /api/v1/posts/{id}` - Delete post

### Connections
- `GET /api/v1/connections/{company_id}` - Get connections
- `POST /api/v1/connections/request` - Send request
- `POST /api/v1/connections/accept/{id}` - Accept request
- `POST /api/v1/connections/reject/{id}` - Reject request
- `DELETE /api/v1/connections/{id}` - Remove connection

### Messages
- `GET /api/v1/messages/{company_id}` - Get conversation
- `POST /api/v1/messages` - Send message
- `PUT /api/v1/messages/{id}/read` - Mark as read

### Jobs, Events, Groups, Reviews, Badges, Search, Admin
See API documentation at http://localhost:8000/docs for full details.

## Admin Access

To access the admin dashboard:

1. Manually set a user's role to 'admin' in the database, or
2. Create a user and update their role via the admin API endpoints

Admin features:
- System statistics
- Manage all companies
- Manage all posts
- Manage user roles
- Content moderation

## Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Manual Deployment

1. Build and run backend Docker container
2. Build and run frontend Docker container
3. Configure reverse proxy (nginx) if needed
4. Set up production database (PostgreSQL recommended)

## Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./b2b_social_network.db
```

## Security Notes

- Change the `SECRET_KEY` in production
- Use HTTPS in production
- Implement proper CORS policies
- Add rate limiting
- Validate all user inputs
- Use environment variables for sensitive data

## Contributing

This is a complete project built by ali hasan. Feel free to fork and enhance!

## License

MIT License - Feel free to use this project for learning and commercial purposes.

## Author

**n by ali hasan**

---

## Support

For issues or questions, please open an issue on GitHub.
