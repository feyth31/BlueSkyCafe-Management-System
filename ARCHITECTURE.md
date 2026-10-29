# System Architecture

## 1. Project Overview

BlueSky Café Management System is a web-based application designed to help manage café operations, including products, inventory, orders, sales, reports, and user accounts.

The application uses a decoupled architecture, with a React frontend communicating with an Express backend through API endpoints. MongoDB stores the application's data.

## 2. Technologies Used

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

### Security
- bcryptjs for password hashing and verification
- Environment variables for configuration

## 3. Architecture Diagram

```text
+-----------------------------------+
|           User / Browser          |
+----------------+------------------+
                 |
                 v
+-----------------------------------+
|        React Frontend             |
|             client/               |
|                                   |
| Dashboard | Products | Inventory  |
| Orders | Sales | Reports | Users  |
+----------------+------------------+
                 |
                 | HTTP API Requests
                 v
+-----------------------------------+
|         Express Backend           |
|             server/               |
|                                   |
| API Routes | Request Handling     |
| Business Logic | Validation       |
+----------------+------------------+
                 |
                 | Mongoose
                 v
+-----------------------------------+
|             MongoDB               |
|                                   |
| Products | Inventory | Orders     |
| Users | Sales-related Data        |
+-----------------------------------+
```

## 4. Application Structure

```text
BlueSkyCafe/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── ...
│   └── package.json
│
├── .env
├── .gitignore
├── README.md
├── CHANGELOG.md
└── ARCHITECTURE.md
```

*Note: The directory names above describe the intended organization. Update this section if your actual folders differ.*

## 5. System Workflow

1. The user opens the application through a web browser.
2. The React frontend displays the system interface.
3. The user performs an action, such as managing a product or creating an order.
4. The frontend sends an HTTP request to the Express backend.
5. The backend processes the request and communicates with MongoDB through Mongoose.
6. MongoDB stores or retrieves the required data.
7. The backend returns a response to the frontend.
8. The frontend updates the interface based on the response.

## 6. Database

MongoDB is used as the application's database.

The backend uses Mongoose to define data models and communicate with the database. The MongoDB connection URI is stored in the `.env` file and should not be committed to the public repository.

## 7. Development Notes

- The frontend and backend are maintained separately.
- The frontend communicates with the backend through API endpoints.
- The backend is responsible for processing requests and accessing the database.
- Sensitive configuration values must be stored in environment variables.
- The project is under active development.
