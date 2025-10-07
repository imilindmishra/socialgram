---

# 📋 PLAN.md — Mini Social Media App (Bootcamp Project)

**Project Name:** SocialGram
**Timeline:** 2–3 Days
**Goal:** Build a simplified Instagram-like app where users can authenticate with Google, create posts (caption + image), and interact through likes and comments.

---

## 🎯 **Core Features**

✅ Google OAuth login
✅ Create posts with caption + image (Cloudinary)
✅ Feed showing all posts (latest first)
✅ Like / unlike posts
✅ Comment on posts
✅ Responsive, minimal UI

---

## ⚙️ **Tech Stack**

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Context API
**Backend:** Node.js, Express.js, TypeScript, Passport (Google OAuth), JWT, Mongoose
**Database:** MongoDB Atlas
**Storage:** Cloudinary (Free tier)
**Hosting:** Vercel (frontend), Render (backend)

---

## 🏗️ **Architecture**

**Flow:**

```
User → React (Axios) → Express Routes → Controllers → MongoDB → Response → Frontend
```

**Structure:**

* **Backend:** MVC (Models, Controllers, Routes, Middleware)
* **Frontend:** Component + Page-based, Context API for Auth

---

## 🧩 **Database Schemas**

### User

```json
{
  "_id": ObjectId,
  "googleId": String,
  "email": String,
  "name": String,
  "profilePicture": String,
  "createdAt": Date
}
```

### Post

```json
{
  "_id": ObjectId,
  "author": ObjectId (ref: User),
  "caption": String,
  "imageUrl": String,
  "likes": [ObjectId],
  "comments": [{ "user": ObjectId, "text": String, "createdAt": Date }],
  "createdAt": Date
}
```

---

## 🗂️ **Project Structure**

```
socialgram/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/ (db, env, cloudinary)
│   │   ├── controllers/ (auth, post, user)
│   │   ├── routes/ (authRoutes, postRoutes)
│   │   ├── middleware/ (auth, errorHandler)
│   │   ├── models/ (User, Post)
│   │   ├── utils/ (jwt, responseHelpers, cloudinary)
│   │   └── validations/
│   └── uploads/ (for local test only)
│
└── frontend/
    ├── src/
    │   ├── pages/ (Home, Login, CreatePost, Profile)
    │   ├── components/ (Navbar, PostCard, CommentBox)
    │   ├── context/ (AuthContext)
    │   ├── lib/api.ts
    │   ├── utils/formatDate.ts
    │   └── styles/globals.css
```

---

## 🔐 **Security Essentials**

* JWT expiration → 7 days
* Validate captions/comments on backend
* Sanitize all user input
* Max 5MB image uploads via Cloudinary
* Never commit `.env` files

---

# 🧱 **DEVELOPMENT PHASES**

---

## 🏁 **PHASE 1 — Setup & Authentication (Day 1)**

**Goal:** Setup full backend + Google OAuth login + React base setup.

### 🔧 Backend

* Initialize Express + TypeScript project
* Connect to MongoDB Atlas (`db.ts`)
* Define `User` model
* Setup Google OAuth via Passport
* Implement JWT generation (`jwt.ts`)
* Routes:

  * `GET /api/auth/google`
  * `GET /api/auth/google/callback`
  * `GET /api/auth/me`
* Test login → returns JWT + user info

### 💻 Frontend

* Setup Vite React + Tailwind CSS
* Add routing (`/login`, `/feed`)
* Integrate Google login (`@react-oauth/google`)
* Store JWT in localStorage
* Create AuthContext → manage `user`, `isAuthenticated`
* After login, redirect → `/feed`

✅ **End of Phase 1 Result:**
User can log in via Google → JWT stored → user state maintained.

---

## 📸 **PHASE 2 — Posts & Feed (Day 2)**

**Goal:** Enable post creation, image upload to Cloudinary, and display posts in feed.

### 🔧 Backend

* Define `Post` model
* Cloudinary config (`cloudinary.ts`)
* Implement endpoints:

  * `POST /api/posts` — create post (caption + image URL)
  * `GET /api/posts` — fetch all posts (sorted by latest)
* Store image URL from Cloudinary API

### 💻 Frontend

* Create **CreatePost** page:

  * Form with caption + image input + preview
  * Upload image to Cloudinary via API call
  * Submit → POST `/api/posts`
* Create **PostCard** component:

  * Displays image, caption, author, likes, comments
* Create **Feed (Home)** page:

  * Fetch posts from `/api/posts`
  * Render in list with PostCard components
* Add Navbar with "Create Post" + "Logout"

✅ **End of Phase 2 Result:**
Users can create posts → see them in feed with images and captions.

---

## ❤️ **PHASE 3 — Likes, Comments & Polish (Day 3)**

**Goal:** Add interactivity + finish UX polish.

### 🔧 Backend

* Add endpoints:

  * `POST /api/posts/:id/like` — toggle like/unlike
  * `POST /api/posts/:id/comments` — add comment
* Populate author and comment user fields in responses

### 💻 Frontend

* Extend **PostCard**:

  * Add heart icon → toggle like (optimistic UI)
  * Show like count
  * Add “View comments” → toggle comment box
* Add **CommentBox**:

  * Input + submit → POST `/api/posts/:id/comments`
  * Display list of comments under post
* Add loading spinners + error handling
* Make design responsive:

  * Center feed (max width 600px)
  * Mobile-first
* Optional: Profile page (user’s own posts)

✅ **End of Phase 3 Result:**
App supports likes, comments, smooth UI, and full interaction loop.

---

# 🧪 **Testing Checklist**

| ✅ Feature   | Test                               |
| ----------- | ---------------------------------- |
| Login       | Google OAuth flow works end-to-end |
| Create Post | Caption + image upload successful  |
| Feed        | Displays all posts correctly       |
| Likes       | Toggle updates instantly           |
| Comments    | Add + display work                 |
| Responsive  | Works on mobile and desktop        |
| Errors      | Handled gracefully                 |

---

# 🚀 **Deployment (Optional)**

* **Backend:** Render → set env vars
* **Frontend:** Vercel → set `VITE_API_URL`
* **DB:** MongoDB Atlas (already cloud)
* Update Google OAuth redirect URIs to production URLs

---

# ✅ **Definition of Done**

* Google login fully functional
* Create / read posts (image + caption)
* Like & comment features complete
* Responsive, clean UI
* All routes protected
* Cloudinary integrated
* No console errors
* Ready to demo 🎉

---

# 🌱 **Stretch Goals (Optional)**

* Profile page (user’s posts)
* Toast notifications
* Infinite scroll feed
* Following system

---


