# JWT Authentication Backend

A robust JWT-based authentication server built with Express.js and MongoDB. This server provides secure user authentication, registration, and profile management with comprehensive security features.

## 🚀 Features

- **JWT Authentication**: Access and refresh token implementation
- **User Management**: Registration, login, profile updates
- **Security**: Password hashing, rate limiting, CORS, helmet protection
- **Validation**: Input validation with express-validator
- **Error Handling**: Comprehensive error handling and logging
- **MongoDB Integration**: Mongoose ODM with optimized schemas
- **Role-based Access**: User and admin role support
- **Environment Configuration**: Flexible configuration management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Environment**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/auth-backend

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # CORS Configuration
   CLIENT_URL=http://localhost:3000
   ```

   **⚠️ Important**: Replace `JWT_SECRET` with a secure random string in production!

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using MongoDB directly
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

#### 4. Get User Profile
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

#### 5. Update Profile
```http
PUT /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### 6. Logout
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### Protected Routes Examples

#### Protected Route
```http
GET /api/protected
```

**Headers:**
```
Authorization: Bearer <access_token>
```

#### Admin Only Route
```http
GET /api/admin
```

**Headers:**
```
Authorization: Bearer <access_token>
```
*Note: User must have admin role*

### Health Check

#### Server Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds of 12
- **JWT Security**: Signed tokens with issuer/audience validation
- **Rate Limiting**: 
  - General routes: 100 requests per 15 minutes
  - Auth routes: 5 requests per 15 minutes
- **CORS Protection**: Configurable origin settings
- **Helmet**: Security headers protection
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Secure error responses (no sensitive data leakage)

## 🏗️ Project Structure

```
auth-backend/
├── config/
│   ├── config.js          # Environment configuration
│   └── database.js        # MongoDB connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   └── User.js            # User schema
├── routes/
│   └── auth.js            # Authentication routes
├── utils/
│   └── jwt.js             # JWT utilities
├── .env                   # Environment variables
├── ENV_SETUP.md          # Environment setup guide
├── package.json
├── README.md
└── server.js             # Main server file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/auth-backend |
| `JWT_SECRET` | JWT signing secret | (change in production) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

### Token Configuration

- **Access Token**: 1 hour expiration
- **Refresh Token**: 7 days expiration (configurable)
- **Token Type**: Bearer token in Authorization header

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Access protected route:**
```bash
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set secure `JWT_SECRET`
   - Configure production `MONGODB_URI`
   - Set `NODE_ENV=production`
   - Update `CLIENT_URL` to production frontend URL

2. **Security**
   - Use HTTPS in production
   - Configure firewall rules
   - Set up MongoDB authentication
   - Consider implementing token blacklisting for logout

3. **Performance**
   - Enable MongoDB indexes
   - Configure connection pooling
   - Set up proper logging
   - Implement monitoring

### Docker Support (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB credentials

2. **JWT Token Issues**
   - Ensure token is sent in Authorization header
   - Check token format: `Bearer <token>`
   - Verify JWT_SECRET is set

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify email format and password requirements

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and stack traces.

## 📞 Support

For support and questions, please create an issue in the repository. 