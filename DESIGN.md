# Social Media Platform Design Document

## 1. High-Level System Architecture

The detailed architecture follows a standard **MERN (MongoDB, Express, React, Node.js)** stack pattern, optimized for scalability and separation of concerns.

### **Architecture Flow:**
1.  **Frontend (Client Layer)**:
    *   **Technology**: React (Vite) + TailwindCSS.
    *   **Role**: Renders the UI, manages application state (e.g., using Context API, Redux, or Zustand), and handles user interactions.
    *   **Communication**: Sends HTTP requests (GET, POST, PUT, DELETE) via Axios/Fetch to the Backend API. Includes JWT Access Token in headers for protected routes.
2.  **Backend (API Layer)**:
    *   **Technology**: Node.js + Express.js.
    *   **Role**: Serves as the REST API. It receives requests, validates input, authenticates users (via JWT), executes business logic, and interacts with the database.
    *   **Security**: Uses Helmet, CORS, and Rate Limiting.
3.  **Database (Data Layer)**:
    *   **Technology**: MongoDB + Mongoose ODM.
    *   **Role**: Stores persistent data (Users, Posts, etc.). Mongoose provides schema validation and relationship management.
4.  **Asset Storage (External Service)**:
    *   *Note: For a production app, binary media (images/videos) should be stored in cloud storage like AWS S3 or Cloudinary, storing only the URL in MongoDB.*

---

## 2. Folder Structure

### **Root Directory**
```text
/
├── backend/                # Server-side code
├── frontend/               # Client-side code
├── .gitignore
├── README.md
└── package.json (optional root script for workspaces)
```

### **Backend Structure** (`/backend`)
```text
backend/
├── src/
│   ├── config/             # DB connection, environment config
│   │   └── db.js
│   ├── controllers/        # Request handlers (logic)
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   └── ...
│   ├── middleware/         # Auth verify, error handling, upload
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── ...
│   ├── routes/             # API route definitions
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── ...
│   ├── utils/              # Helper functions (token gen, validation)
│   └── app.js              # Express app setup
├── .env
├── package.json
└── server.js               # Entry point used to start server
```

### **Frontend Structure** (`/frontend`)
```text
frontend/
├── public/                 # Static assets like favicon
├── src/
│   ├── assets/             # Images, global styles
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Buttons, Inputs, Modals
│   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   ├── feed/           # PostCard, Feed configurations
│   │   └── profile/        # ProfileHeader, Bio
│   ├── context/            # Global state (AuthContext, ThemeContext)
│   ├── hooks/              # Custom React hooks (useAuth, useFetch)
│   ├── pages/              # Page views (Home, Login, Profile)
│   ├── services/           # API call functions (axios instances)
│   │   ├── api.js
│   │   └── authService.js
│   ├── utils/              # Helpers (date formatting, validators)
│   ├── App.jsx             # Main App component with Routes
│   └── main.jsx            # Entry point
├── .env
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 3. MongoDB Schemas

### **1. User Schema**
```javascript
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  fullName: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, maxlength: 160 },
  website: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });
```

### **2. Post Schema**
```javascript
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  caption: { type: String, maxlength: 2200 },
  mediaUrl: { type: String }, // Image or Video URL
  mediaType: { type: String, enum: ['image', 'video'] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array for smaller scale, count for larger
  commentsCount: { type: Number, default: 0 },
  location: { type: String },
}, { timestamps: true });
```

### **3. Comment Schema**
```javascript
const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
```

### **4. Like Schema (Optional/Scalable)**
*Note: For high scalability, store likes here instead of arrays in Post.*
```javascript
const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
}, { timestamps: true });
// Compound unique index to prevent double liking
LikeSchema.index({ user: 1, post: 1 }, { unique: true });
```

### **5. FriendRequest Schema**
```javascript
const FriendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });
```

### **6. Notification Schema**
```javascript
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'request'], required: true },
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
```

### **7. Story Schema**
```javascript
const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mediaUrl: { type: String, required: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000 },
}, { timestamps: true });

// TTL Index for auto-deletion after 24 hours
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 4. Schema Relationships

1.  **User ↔ others**: The core entity. Almost every other schema references `User` (as author, liker, follower).
2.  **User ↔ User (Follow/Friend)**:
    *   Modeled as `followers` and `following` arrays in the User schema for quick access (good for read-heavy apps).
    *   Alternatively, a separate `Follow` collection can be used for very large scales to avoid the 16MB document limit in MongoDB.
3.  **Post ↔ Comment**: One-to-Many. Comments reference the `Post` ID.
4.  **Auto-Expiration**: Stories use MongoDB's TTL (Time To Live) index functionality via the `expiresAt` field to automatically delete themselves after 24 hours.

---

## 5. REST API Route Structure

### **A. Authentication (`/api/auth`)**
*   `POST /register` - Create a new user
*   `POST /login` - Authenticate and return JWT
*   `POST /logout` - Clear cookies/tokens
*   `GET /me` - Get current user profile (protected)

### **B. Users (`/api/users`)**
*   `GET /:username` - Get public profile
*   `PUT /update` - Update own profile (bio, image)
*   `POST /:id/follow` - Follow/Unfollow user
*   `GET /:id/followers` - Get followers list
*   `GET /:id/following` - Get following list
*   `GET /search?q=name` - Search users

### **C. Posts (`/api/posts`)**
*   `POST /` - Create a new post (w/ image upload)
*   `GET /feed` - Get timeline posts (aggregated from following)
*   `GET /:id` - Get single post details
*   `DELETE /:id` - Delete own post
*   `POST /:id/like` - Toggle like on a post

### **D. Comments (`/api/comments`)**
*   `POST /:postId` - Add comment to post
*   `DELETE /:commentId` - Delete comment

### **E. Stories (`/api/stories`)**
*   `POST /` - Upload a story
*   `GET /feed` - Get valid stories from following users

### **F. Notifications (`/api/notifications`)**
*   `GET /` - Get user notifications
*   `PUT /:id/read` - Mark notification as read
