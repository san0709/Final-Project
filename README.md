# Social Media Platform

A full-stack MERN social media application with real-time features, authentication, and modern UI.

## 🚀 Live Demo

- **Frontend**: [https://your-app-name.netlify.app](https://your-app-name.netlify.app)
- **Backend API**: [https://your-backend-app.onrender.com](https://your-backend-app.onrender.com)

## ✨ Features

### User Authentication
- JWT-based authentication with HTTP-only cookies
- User registration and login
- Password reset via email
- Secure password hashing with bcrypt

### Social Features
- **Posts**: Create, edit, delete posts with text and media
- **Comments**: Add, delete comments on posts
- **Likes**: Like/unlike posts and comments
- **Friends**: Send, accept, decline friend requests
- **Stories**: 24-hour auto-expiring stories
- **News Feed**: Personalized feed from friends
- **Notifications**: Real-time alerts for interactions
- **User Profiles**: Customizable profiles with cover photos

### Technical Features
- Responsive mobile-first design
- Optimistic UI updates
- Infinite scroll pagination
- Image/video support (Local storage with Multer)
- MongoDB TTL for auto-expiring stories
- Protected routes
- Error handling and validation

## 🛠️ Tech Stack

### Frontend
- React 19 (Vite)
- TailwindCSS v4
- React Router v7
- Axios
- Context API for state management
- React Icons
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer
- Cookie-parser
- CORS
- Multer (File Uploads)

## 📁 Project Structure

```
Final Project/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
├── DESIGN.md
└── DEPLOYMENT.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Final\ Project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/social_media_db
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_REFRESH_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

   Start backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file (optional for development, uses proxy):
   ```env
   VITE_API_URL=/api
   ```

   Start frontend:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Backend deployment on Render
- Frontend deployment on Netlify
- MongoDB Atlas setup
- Environment variables configuration

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/profile/me` - Get current user profile
- `GET /api/users/:username` - Get user by username
- `PUT /api/users/profile` - Update profile
- `POST /api/users/friend-request/:userId` - Send friend request
- `PUT /api/users/friend-request/:requestId/accept` - Accept request
- `PUT /api/users/friend-request/:requestId/decline` - Decline request
- `GET /api/users/friend-requests` - Get pending requests
- `DELETE /api/users/friends/:friendId` - Remove friend

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed posts
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post

### Uploads
- `POST /api/upload` - Upload image/video file

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/like` - Like/unlike comment

### Stories
- `POST /api/stories` - Create story
- `GET /api/stories` - Get active stories

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Create, edit, delete posts
- [ ] Uploading images/videos
- [ ] Like and comment functionality
- [ ] Friend request flow
- [ ] Notifications display
- [ ] Story creation and viewing
- [ ] Profile updates
- [ ] Responsive design on mobile

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- Password hashing with bcrypt
- CORS configuration
- Protected API routes
- Input validation
- MongoDB injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Sandy - Initial work

## 🙏 Acknowledgments

- Design inspiration from modern social media platforms
- MERN stack community
- TailwindCSS for styling utilities
