# Fitness AI Backend

Express.js + TypeScript backend ready for database integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 📦 Setup Database

### Option 1: MongoDB

```bash
# Install MongoDB driver
npm install mongoose

# Update .env
MONGODB_URI=mongodb://localhost:27017/fitness-ai

# Uncomment MongoDB code in src/server.ts
```

### Option 2: PostgreSQL

```bash
# Install PostgreSQL driver
npm install pg

# Update .env
DATABASE_URL=postgresql://username:password@localhost:5432/fitness_ai

# Uncomment PostgreSQL code in src/server.ts
```

### Option 3: Prisma (any database)

```bash
# Install Prisma
npm install prisma @prisma/client
npx prisma init

# Configure your database in schema.prisma
# Run migrations
npx prisma migrate dev
```

## 🔐 Add Authentication

```bash
npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

Then uncomment the auth code in:
- `src/routes/auth.ts`
- `src/middleware/auth.ts`

## 📝 API Routes (Ready to implement)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/nutrition` - Get user meals
- `POST /api/nutrition` - Log meal
- `DELETE /api/nutrition/:id` - Delete meal

## 🛠️ Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main server file
│   ├── models/             # Database models
│   │   ├── User.ts
│   │   ├── Workout.ts
│   │   └── Meal.ts
│   ├── routes/             # API routes
│   │   ├── auth.ts
│   │   ├── workouts.ts
│   │   └── nutrition.ts
│   └── middleware/         # Middleware
│       └── auth.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Next Steps

1. Choose and install database (MongoDB/PostgreSQL)
2. Uncomment database connection in `server.ts`
3. Uncomment model definitions
4. Install bcrypt and JWT for authentication
5. Uncomment route implementations
6. Test endpoints with Postman/Thunder Client
7. Connect frontend to backend API

## 📚 Additional Packages (Optional)

```bash
# Validation
npm install zod

# API Documentation
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc

# Rate limiting
npm install express-rate-limit

# Security
npm install helmet
```

## 🔒 Security Best Practices

- Never commit `.env` file
- Use strong JWT secrets
- Hash passwords with bcrypt
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting
- Use helmet for security headers

## 🚀 Deployment

Build for production:

```bash
npm run build
npm start
```

Deploy to:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure
