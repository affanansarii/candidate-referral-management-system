# Candidate Referral Management System

## 📋 Project Overview

A full-stack web application for managing candidate referrals with user authentication. This system allows users to refer candidates, track their status, and manage referrals efficiently.

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Context** for state management
- **React Router DOM** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests


## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Personal data isolation

### Candidate Management
- Add new candidates with form validation
- Upload PDF resumes (max 5MB)
- Update candidate status (Pending → Reviewed → Hired)
- Delete candidates
- Search and filter functionality

### Dashboard
- Real-time metrics display
- Responsive design
- Modal-based forms
- Status tracking with visual indicators

## 📋 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Candidate Routes (Protected)
- `GET /api/candidates` - Get all candidates for user
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id/status` - Update candidate status
- `DELETE /api/candidates/:id` - Delete candidate

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   # Create .env file and add:
MONGODB_URI=mongodb://localhost:27017/referral_system
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
npm run dev
