# Next.js Gielda Transport Application

A comprehensive transport marketplace application built with Next.js 14, featuring real-time messaging, user management, and transport logistics management.

## 🚀 Features

- **Transport Marketplace**: Create, manage, and bid on transport offers
- **Real-time Messaging**: Socket.io powered chat system for communication
- **User Management**: Multi-role system (admin, school_admin, user, student)
- **School Integration**: School-specific transport management
- **Interactive Maps**: Google Maps integration for route planning
- **File Uploads**: Document and image upload support
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Authentication**: Secure NextAuth.js implementation
- **Database**: MongoDB with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Socket.io
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Maps**: Google Maps API, React Google Maps
- **File Upload**: UploadThing
- **Real-time**: Socket.io
- **Deployment**: Docker, Nginx, AlmaLinux 9

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6.0+
- npm or yarn
- Google Maps API key
- Email service (SMTP)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd next_gielda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run setup:db
   ```

5. **Create admin user**
   ```bash
   npm run setup:admin
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/next_gielda"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_PUBLIC_SITE_URL="http://localhost:3000"

# Server
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="your-google-maps-api-key"

# Email
EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@yourdomain.com"

# UploadThing (optional)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## 🐳 Docker Deployment

### Production with Docker Compose (Recommended)

1. **Quick setup with automated script**
   ```bash
   chmod +x scripts/docker-setup.sh
   ./scripts/docker-setup.sh
   ```

2. **Manual setup**
   ```bash
   # Copy environment file
   cp env.docker .env
   # Edit .env with your production values
   
   # Start the application
   docker-compose -f docker-compose.prod.yml up -d
   
   # Initialize database and create admin user
   docker-compose -f docker-compose.prod.yml exec app node scripts/init-production.js
   ```

3. **Check status**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f
   ```

### Development with Docker Compose

1. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your development values
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Check logs**
   ```bash
   docker-compose logs -f
   ```

### Using Docker

1. **Build the image**
   ```bash
   docker build -t next-gielda .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name next-gielda \
     -p 3000:3000 \
     -e DATABASE_URL="mongodb://host.docker.internal:27017/next_gielda" \
     -e NEXTAUTH_URL="https://yourdomain.com" \
     -e NEXTAUTH_SECRET="your-secret" \
     next-gielda
   ```

## 🖥️ Production Deployment

### Automated Deployment (AlmaLinux 9)

1. **Run the deployment script**
   ```bash
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

2. **Follow the interactive prompts**
   - Configure domain name
   - Set up SSL certificate
   - Complete the setup

### Manual Deployment

See [README-DEPLOYMENT.md](./README-DEPLOYMENT.md) for detailed manual deployment instructions.

## 👤 Admin Setup

### Automatic Setup

The deployment process automatically creates a default admin user:

- **Username**: `admin`
- **Email**: `admin@yourdomain.com`
- **Password**: [Generated secure password displayed during setup]

### Manual Admin Creation

```bash
# Interactive admin creation
npm run setup:admin

# Command line admin creation
node scripts/create-admin.js --username admin --email admin@example.com --password SecurePass123!
```

### Admin Panel Access

1. Login with admin credentials
2. Navigate to `/admin`
3. Access full administrative features

**⚠️ Important**: Change the default admin password after first login!

For detailed admin management, see [ADMIN-SETUP.md](./ADMIN-SETUP.md).

## 📊 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start development server |
| Build | `npm run build` | Build for production |
| Build (Prod) | `npm run build:prod` | Build with production config |
| Start | `npm run start` | Start production server |
| Start (Prod) | `npm run start:prod` | Start with production settings |
| Lint | `npm run lint` | Run ESLint |
| Database Setup | `npm run setup:db` | Initialize database |
| Admin Setup | `npm run setup:admin` | Create admin user |
| Production Init | `npm run init:prod` | Full production setup |
| Test Admin | `npm run test:admin` | Test admin setup |

## 🏗️ Project Structure

```
next_gielda/
├── app/                    # Next.js app directory
│   ├── (private)/         # Protected routes
│   │   ├── admin/         # Admin panel
│   │   ├── school/        # School management
│   │   ├── transport/     # Transport management
│   │   └── user/          # User dashboard
│   ├── (public)/          # Public routes
│   │   └── (auth)/        # Authentication pages
│   ├── api/               # API routes
│   └── context/           # React contexts
├── components/             # Reusable components
│   ├── ui/                # UI components
│   └── dashboard/         # Dashboard components
├── lib/                    # Utility libraries
├── prisma/                 # Database schema
├── scripts/                # Setup and utility scripts
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── nginx.conf              # Nginx configuration
├── deploy.sh               # Deployment script
└── README-DEPLOYMENT.md    # Deployment guide
```

## 🔧 Configuration

### Database Schema

The application uses MongoDB with the following main models:

- **User**: User accounts with role-based access
- **School**: Educational institutions
- **Transport**: Transport offers and requests
- **Offer**: Bids on transport services
- **Message**: Real-time messaging
- **Category**: Transport categories
- **Vehicle**: Vehicle types

### User Roles

- **admin**: Full system administrator
- **school_admin**: School-specific administrator
- **user**: Regular transport user
- **student**: Student with limited access

### API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/transports/*` - Transport management
- `/api/offers/*` - Offer management
- `/api/schools/*` - School management
- `/api/users/*` - User management
- `/api/messages/*` - Messaging system
- `/api/uploadthing/*` - File uploads

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Check environment variables
   npm run test:admin
   
   # Rebuild with production config
   npm run build:prod
   ```

2. **Database Connection**
   ```bash
   # Test database connection
   node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$queryRaw\`SELECT 1\`.then(() => console.log('Connected')).catch(console.error).finally(() => prisma.$disconnect());"
   ```

3. **Admin Access Issues**
   ```bash
   # Create new admin user
   npm run setup:admin
   
   # Test admin setup
   npm run test:admin
   ```

### Logs and Monitoring

```bash
# Application logs
sudo journalctl -u next-gielda -f

# Docker logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📚 Documentation

- [Deployment Guide](./README-DEPLOYMENT.md) - Complete deployment instructions
- [Docker Production Guide](./DOCKER-PRODUCTION.md) - Docker Compose production setup
- [Admin Setup Guide](./ADMIN-SETUP.md) - Admin user management
- [Production Checklist](./PRODUCTION-CHECKLIST.md) - Production verification steps

## 🔒 Security

- **Authentication**: NextAuth.js with secure session management
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF tokens
- **Rate Limiting**: Nginx rate limiting configuration

## 🚀 Performance

- **Static Generation**: Next.js static site generation
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting
- **Caching**: Nginx caching configuration
- **Compression**: Gzip compression enabled
- **CDN Ready**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**