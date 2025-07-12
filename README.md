# ReWear – Community Clothing Exchange

A web-based platform that enables users to swap unused clothing either through direct swaps or by redeeming points. Built for a hackathon with speed and simplicity in mind, while maintaining clean, modular code.

## Features

- **User Authentication**: Email/password login with JWT
- **Landing Page**: Platform intro with featured items carousel
- **User Dashboard**: Profile, points balance, uploaded items, and swap history
- **Item Detail Page**: Full item info with swap request functionality
- **Add New Item**: Form for image upload and item details
- **Admin Panel**: Approve/reject items and manage users

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd rewear-community-clothing-exchange
   ```

2. Install server dependencies
   ```
   npm install
   ```

3. Install client dependencies
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=3600
   ```

### Running the Application

1. Run both the server and client concurrently
   ```
   npm run dev
   ```

2. For production build
   ```
   npm run build-client
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/auth` - Login user
- `GET /api/auth` - Get authenticated user

### Users
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Items
- `POST /api/items` - Create a new item
- `GET /api/items` - Get all approved items
- `GET /api/items/user` - Get current user's items
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Swaps
- `POST /api/swaps` - Create a new swap request
- `GET /api/swaps` - Get all swaps for current user
- `GET /api/swaps/:id` - Get swap by ID
- `POST /api/swaps/:id/message` - Add message to swap
- `PUT /api/swaps/:id/status` - Update swap status

### Admin
- `GET /api/admin/items/pending` - Get all pending items
- `PUT /api/admin/items/:id/approve` - Approve an item
- `PUT /api/admin/items/:id/reject` - Reject an item
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/admin` - Toggle admin status for a user
- `GET /api/admin/stats` - Get platform statistics
- `DELETE /api/admin/items/:id` - Delete an item (admin override)

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # React components
│       ├── context/        # Context API state
│       └── utils/          # Utility functions
├── config/                 # Configuration files
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
│   └── api/                # API endpoints
├── .env                    # Environment variables
├── package.json            # Dependencies
├── server.js               # Express server
└── README.md               # Project documentation
```

## Contributing

This project was created for a hackathon, but contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.