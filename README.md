# AI Chatbot Project

This repository contains a full-stack AI chatbot application with a React + Vite frontend and an Express + Socket.IO backend.

## Project Structure

- `Backend/`
  - Express server
  - MongoDB via Mongoose
  - JWT authentication with cookies
  - Socket.IO chat messaging
  - Google GenAI integration for AI responses
  - Pinecone vector storage for memory/querying
- `Frontend/`
  - React with Vite
  - React Router for navigation
  - Redux Toolkit for chat state
  - Axios for API requests
  - Socket.IO client for real-time AI responses

## Features

- User registration and login
- Protected chat experience
- Create and select conversations
- Real-time AI responses over Socket.IO
- Persistent message storage in MongoDB
- AI prompt / vector embedding support via Google GenAI and Pinecone

## Getting Started

### Backend

1. Open a terminal inside `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Backend/` with at least the following values:
   ```env
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PINECONE_API_KEY=<your-pinecone-api-key>
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal inside `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at the Vite dev URL (usually `http://localhost:5173`).

## Notes

- The frontend currently uses a deployed API URL (`https://ai-chatbot-8mzp.onrender.com`) in the auth and chat pages.
- For local development, update API endpoints in `Frontend/src/pages/Login.jsx`, `Frontend/src/pages/Register.jsx`, and `Frontend/src/pages/Home.jsx` to point to your local backend (for example `http://localhost:3000`).
- The backend CORS configuration already allows `http://localhost:5173`.

## Useful Commands

### Backend
- `npm run dev` — start backend with `nodemon`
- `npm start` — start backend normally

### Frontend
- `npm run dev` — start frontend in development mode
- `npm run build` — build production assets
- `npm run preview` — preview production build locally

## Useful Files

- `Backend/server.js` — backend entry point
- `Backend/src/app.js` — Express app setup and routes
- `Backend/src/DB/db.js` — MongoDB connection
- `Frontend/src/App.jsx` — React app root
- `Frontend/src/AppRoutes.jsx` — application routing
- `Frontend/src/pages/Home.jsx` — chat UI and socket handling
- `Frontend/src/pages/Login.jsx` — login page
- `Frontend/src/pages/Register.jsx` — registration page

## Development Tips

- Keep the backend running before using the frontend locally.
- If cookies are not being set, confirm the backend is running on the correct origin and your browser allows same-site cookies.
- If you want to use local API URLs, search for `https://ai-chatbot-8mzp.onrender.com` and replace with `http://localhost:3000`.

