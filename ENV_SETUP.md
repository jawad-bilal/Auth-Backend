# Environment Setup

Create a `.env` file in the root directory with the following variables:

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

**Important:** 
- Change the `JWT_SECRET` to a secure random string in production
- Update `MONGODB_URI` with your actual MongoDB connection string
- Adjust `CLIENT_URL` to match your frontend application URL 