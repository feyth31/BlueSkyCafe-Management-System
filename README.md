# BlueSky Café Management System

A café management web application designed to help manage café operations, including products, inventory, customer orders, sales, reports, and user accounts.

## Project Overview

BlueSky Café Management System is a full-stack web application developed as a 3rd Year Final Project. It uses a React frontend, an Express.js backend, and MongoDB for data storage.

The application aims to provide a centralized system for managing café operations while demonstrating concepts from Web Systems, Integrative Programming, Advanced Database, and Systems Integration & Architecture.

## Features

- **Dashboard** — View an overview of café operations.
- **Product Management** — Add, view, update, and delete café products.
- **Inventory Management** — Monitor available product stock.
- **Order Management** — Manage customer orders.
- **Order History** — Review previously recorded orders.
- **Sales** — View sales information.
- **Reports** — Review café reports.
- **User Management** — Manage user accounts and roles.
- **Login** — Sign in to the application.

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB

## Project Structure

```text
BlueSkyCafe/
├── client/          # React frontend
├── server/          # Express backend and API
├── .gitignore
├── README.md
├── CHANGELOG.md
└── ARCHITECTURE.md
```

## Requirements

Install the following before running the project:

- Node.js and npm
- MongoDB Community Server
- Git
- Visual Studio Code (recommended)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/feyth31/BlueSkyCafe-Management-System.git
cd BlueSkyCafe-Management-System
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

Add your MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/blueskycafe
```

Keep your `.env` file private. Do not commit it to GitHub.

### 4. Start MongoDB

Make sure your local MongoDB service is running before starting the backend.

### 5. Start the backend

From the `server` folder, run:

```bash
node server.js
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 7. Start the frontend

From the `client` folder, run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Development Notes

- The frontend and backend are maintained separately in the `client` and `server` folders.
- The backend provides API endpoints for the frontend.
- MongoDB stores application data.
- Environment variables are used for configuration.

## Project Status

This project is under development. Features and interface improvements may be added as development continues.

## Author

Angel Faith P. Tuante  
BSIT – 3rd Year
