# 🚛 Next.js Giełda Transportowa - Fenilo.pl

Nowoczesna platforma giełdy transportowej zbudowana z użyciem Next.js 14, oferująca kompleksowy system zarządzania transportem, komunikację w czasie rzeczywistym oraz zaawansowane funkcjonalności dla różnych typów użytkowników.

## 🎯 Główne Funkcjonalności

### 🚚 System Transportowy
- **Giełda Transportowa**: Tworzenie, zarządzanie i składanie ofert transportowych
- **Interaktywne Mapy**: Integracja z Google Maps dla planowania tras
- **System Ofert**: Składanie ofert z kalkulatorem cenowym (netto/brutto/VAT)
- **Kategorie Transportu**: Różne rodzaje transportu i pojazdów
- **Śledzenie Zleceń**: Pełna historia transportów i ich statusów

### 💬 Komunikacja
- **Komunikacja w Czasie Rzeczywistym**: Socket.io dla instant messaging
- **System Wiadomości**: Wbudowany czat między użytkownikami
- **Powiadomienia**: Automatyczne powiadomienia o nowych ofertach

### 👥 Zarządzanie Użytkownikami
- **System Ról**: admin, school_admin, user, student
- **Integracja ze Szkołami**: Specjalny system dla szkół i uczniów
- **Profil Użytkownika**: Kompleksowe zarządzanie danymi użytkowników
- **Bezpieczna Autoryzacja**: NextAuth.js z obsługą różnych providerów

### 📊 Panel Administracyjny
- **Dashboard Administratora**: Zarządzanie użytkownikami i transportami
- **Raporty**: Generowanie raportów dotyczących aktywności platformy
- **Zarządzanie Kategoriami**: Dodawanie/edycja kategorii i pojazdów
- **Monitoring Systemu**: Śledzenie działania aplikacji

### 📁 Zarządzanie Plikami
- **Upload Dokumentów**: UploadThing dla bezpiecznego przesyłania plików
- **Generowanie PDF**: Automatyczne tworzenie dokumentów transportowych
- **Szablony Dokumentów**: Gotowe wzory faktur, CMR, zleceń

### 🗺️ Funkcjonalności Mapowe
- **Planowanie Tras**: Automatyczne wyznaczanie tras między punktami
- **Wizualizacja Pojazdów**: 3D modele pojazdów z Three.js
- **Geolokalizacja**: Automatyczne wykrywanie lokalizacji
- **Wyszukiwanie Miejsc**: Integracja z Google Places API

## 🛠️ Stack Technologiczny

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Język**: TypeScript
- **Styling**: Tailwind CSS, Radix UI, DaisyUI
- **State Management**: React Query (TanStack Query)
- **Formularze**: React Hook Form + Zod
- **Animacje**: Framer Motion, Lottie React
- **3D**: Three.js, React Three Fiber/Drei

### Backend
- **API**: Next.js API Routes
- **Real-time**: Socket.io
- **Baza Danych**: MongoDB z Prisma ORM
- **Autoryzacja**: NextAuth.js
- **Hashowanie**: bcrypt
- **Walidacja**: Zod

### Mapy i Lokalizacja
- **Mapy**: Google Maps API, React Google Maps
- **Alternatywne Mapy**: React Leaflet
- **Autocompletowanie**: use-places-autocomplete

### Pliki i Media
- **Upload**: UploadThing
- **PDF**: pdf-lib
- **Obrazy**: Next.js Image Optimization
- **Excel**: XLSX (SheetJS)

### DevOps i Deploy
- **Konteneryzacja**: Docker + Docker Compose
- **Proxy**: Nginx
- **SSL/TLS**: Let's Encrypt (Certbot)
- **System**: AlmaLinux 9
- **Monitoring**: Logi systemowe

### Email i Komunikacja
- **Email**: Nodemailer
- **Messenger**: React Messenger Chat Plugin
- **Powiadomienia**: Courier

## 📋 Wymagania Systemowe

- **Node.js**: 18.0 lub nowszy
- **MongoDB**: 5.0 lub nowszy (z replica set)
- **Docker**: 20.0+ (opcjonalne, dla konteneryzacji)
- **npm/yarn**: Najnowsza stabilna wersja

### Wymagane API Keys
- Google Maps API (Maps, Places, Geocoding)
- UploadThing API Key
- SMTP Server (dla emaili)
- NextAuth Secret

## 🚀 Szybki Start

### Rozwój Lokalny

1. **Sklonuj repozytorium**
   ```bash
   git clone <your-repository-url>
   cd next_gielda
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   # lub
   yarn install
   ```

3. **Skonfiguruj zmienne środowiskowe**
   ```bash
   cp .env.example .env.local
   # Edytuj .env.local z własną konfiguracją
   ```

4. **Skonfiguruj bazę danych**
   ```bash
   npm run setup:db
   ```

5. **Utwórz administratora**
   ```bash
   npm run setup:admin
   # lub z zmiennych środowiskowych
   npm run setup:admin:env
   ```

6. **Uruchom serwer developerski**
   ```bash
   npm run dev
   ```

7. **Otwórz przeglądarkę**
   Przejdź do [http://localhost:3000](http://localhost:3000)

### Zmienne Środowiskowe

Utwórz plik `.env.local` z następującymi zmiennymi:

```env
# Baza danych
DATABASE_URL="mongodb://localhost:27017/next_gielda"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="twoj-bardzo-bezpieczny-sekret-nextauth"
NEXTAUTH_PUBLIC_SITE_URL="http://localhost:3000"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="twoj-google-maps-api-key"

# UploadThing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="twoj-uploadthing-app-id"

# Email Configuration (SMTP)
EMAIL_SERVER_USER="twoj-email@gmail.com"
EMAIL_SERVER_PASSWORD="twoje-hasło-aplikacji"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_FROM="twoj-email@gmail.com"

# Admin User (do automatycznego tworzenia)
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="bezpieczne-hasło"

# Socket.io (opcjonalne)
SOCKET_URL="http://localhost:3000"
```

## 🐳 Wdrożenie z Docker

### Produkcja z Docker Compose (Zalecane)

**Konfiguracja Docker:**
   ```bash
   # Sklonuj i przygotuj projekt
   git clone <repository-url>
   cd next_gielda
   
   # Skopiuj i skonfiguruj zmienne środowiskowe
   cp .env.example .env.production
   # Edytuj .env.production
   
   # Uruchom kontenery
   docker-compose up -d
   
   # Inicjalizuj bazę danych i admina
   npm run init:prod
   ```

3. **Zarządzanie kontenerami**
   ```bash
   # Uruchomienie wszystkich serwisów
   docker-compose up -d
   
   # Zatrzymanie wszystkich serwisów
   docker-compose down
   
   # Restart serwisów
   docker-compose restart
   
   # Status kontenerów
   docker-compose ps
   
   # Przegląd logów
   docker-compose logs -f
   
   # Aktualizacja (rebuild)
   docker-compose up -d --build
   
   # Backup bazy danych
   docker-compose exec mongodb mongodump --out /data/backup
   
   # Health check
   docker-compose exec next-gielda curl -f http://localhost:3000/api/health
   ```

### SSL/HTTPS Configuration

Aplikacja zawiera automatyczną konfigurację SSL z Let's Encrypt:

```bash
# Konfiguracja SSL
chmod +x setup-ssl.sh
./setup-ssl.sh twoja-domena.pl
```

## 📚 Dostępne Skrypty

```bash
# Rozwój
npm run dev                 # Uruchom w trybie developerskim
npm run build              # Zbuduj dla produkcji
npm run start              # Uruchom w trybie produkcyjnym
npm run lint               # Sprawdź kod z ESLint

# Baza danych i setup
npm run setup:db           # Konfiguruj bazę danych
npm run setup:admin        # Utwórz administratora (interaktywnie)
npm run setup:admin:env    # Utwórz administratora z .env
npm run setup:full         # Pełna konfiguracja (db + admin)
npm run init:admin         # Inicjalizuj admina
npm run init:prod          # Inicjalizuj dla produkcji
npm run test:admin         # Testuj konto administratora

# Budowanie
npm run build:prod         # Build dla produkcji
npm run start:prod         # Start w trybie produkcyjnym
```

## �️ Struktura Projektu

```
next_gielda/
├── 📁 app/                      # Next.js 14 App Router
│   ├── 📁 (private)/            # Chronione strony (wymagana autoryzacja)
│   │   ├── 📁 admin/            # Panel administratora
│   │   ├── 📁 transport/        # Giełda transportowa
│   │   ├── 📁 user/             # Panel użytkownika
│   │   ├── 📁 vehicles/         # Zarządzanie pojazdami
│   │   └── 📁 documents/        # Dokumenty i szablony
│   ├── 📁 (public)/             # Publiczne strony
│   │   ├── 📁 (auth)/           # Autoryzacja (login/register)
│   │   └── 📁 privacy-policy/   # Polityka prywatności
│   ├── 📁 api/                  # API Routes
│   │   ├── 📁 auth/             # NextAuth endpoints
│   │   ├── 📁 transports/       # Transport API
│   │   ├── 📁 offers/           # Oferty API
│   │   └── 📁 socket/           # Socket.io endpoints
│   └── 📁 context/              # React Context providers
├── 📁 components/               # Komponenty React
│   ├── 📁 ui/                   # Podstawowe komponenty UI
│   ├── 📁 dashboard/            # Komponenty dashboardu
│   └── 📁 models/               # Modele 3D
├── 📁 lib/                      # Biblioteki pomocnicze
├── 📁 prisma/                   # Schema bazy danych
├── 📁 scripts/                  # Skrypty pomocnicze
├── 📁 ssl/                      # Certyfikaty SSL
├── 📁 logs/                     # Logi aplikacji
├── 📁 backups/                  # Kopie zapasowe
├── 📁 uploads/                  # Przesłane pliki
└── 📁 utils/                    # Funkcje pomocnicze
```

## 🔑 Kluczowe Funkcjonalności Szczegółowo

### System Transportowy
- **Tworzenie Zleceń**: Formularz z mapą, kategorią, pojazdem
- **Śledzenie tras**: Google Maps z wyznaczaniem najkrótszej trasy
- **Kalkulacja kosztów**: Automatyczne obliczenia netto/brutto/VAT
- **Status transportu**: Oczekujący → W realizacji → Zakończony

### System Ofert
- **Składanie ofert**: Formularz z ceną, datami, kontaktem
- **Porównywanie ofert**: Tabela z wszystkimi ofertami dla zlecenia
- **Akceptacja ofert**: System wyboru najlepszej oferty
- **Historia ofert**: Archiwum wszystkich złożonych/otrzymanych ofert

### Panel Administratora
- **Dashboard**: Statystyki, wykresy aktywności
- **Użytkownicy**: Zarządzanie kontami, role, uprawnienia
- **Kategorie**: Dodawanie typów transportu i pojazdów
- **Raporty**: Generowanie raportów Excel/PDF
- **Monitoring**: Śledzenie błędów i wydajności

### System Szkolny
- **Integracja szkół**: Specjalny panel dla administratorów szkół
- **Zarządzanie uczniami**: System dla uczniów i opiekunów
- **Transporty szkolne**: Dedykowane funkcje dla przewozów szkolnych

## 🔒 Bezpieczeństwo

- **Autoryzacja**: NextAuth.js z bezpiecznymi sesjami
- **Hashowanie haseł**: bcrypt z solą
- **HTTPS**: Wymuszenie szyfrowanego połączenia
- **Walidacja danych**: Zod dla validation na frontend i backend
- **CORS**: Właściwe konfiguracje Cross-Origin
- **Rate limiting**: Ochrona przed spam i atakami
- **SQL Injection**: Prisma ORM zapobiega atakom

## 🔧 Konfiguracja Produkcyjna

### Automatyczne Wdrożenie (AlmaLinux 9)

1. **Uruchom skrypt wdrożenia**
   ```bash
   chmod +x scripts/deploy-production.sh
   sudo ./scripts/deploy-production.sh
   ```

2. **Postępuj zgodnie z instrukcjami**
   - Skonfiguruj nazwę domeny
   - Ustaw certyfikat SSL
   - Dokończ instalację

### Ręczne Wdrożenie

```bash
# 1. Przygotuj środowisko produkcyjne
cp .env.example .env.production

# 2. Zbuduj aplikację
npm run build:prod

# 3. Uruchom w trybie produkcyjnym
npm run start:prod
```

## 👤 Konfiguracja Administratora

### Automatyczne Tworzenie Admina
```bash
# Z interakcją
npm run setup:admin

# Ze zmiennych środowiskowych
npm run setup:admin:env

# Test konta administratora  
npm run test:admin
```

### Ręczne Tworzenie Admina
```bash
# Uruchom skrypt interaktywny
node scripts/create-admin.js

# Lub zainicjuj ze zmiennych środowiskowych
node scripts/init-admin.js
```

## 🧪 Testowanie

```bash
# Lint kodu
npm run lint

# Test połączenia z bazą
npm run test:admin

# Sprawdź health aplikacji
curl http://localhost:3000/api/health
```

## 📊 Monitoring i Logi

### Struktura Logów
```
logs/
├── nginx/              # Logi Nginx
├── app.log            # Logi aplikacji
├── error.log          # Logi błędów
└── access.log         # Logi dostępu
```

### Health Checks
- `/api/health` - Status aplikacji
- `docker-compose exec next-gielda curl -f http://localhost:3000/api/health` - Status kontenerów
- Automatyczne sprawdzanie MongoDB replica set

## 🔄 Backup i Restore

```bash
# Backup MongoDB w Docker
docker-compose exec mongodb mongodump --out /data/backup

# Ręczny backup MongoDB (lokalnie)
mongodump --host localhost:27017 --db next_gielda --out ./backups/

# Restore z backup
mongorestore --host localhost:27017 --db next_gielda ./backups/next_gielda/
```

## 🐛 Rozwiązywanie Problemów

### Częste Problemy

1. **Błąd połączenia z MongoDB**
   ```bash
   # Sprawdź status MongoDB
   systemctl status mongod
   
   # Sprawdź logi MongoDB
   tail -f /var/log/mongodb/mongod.log
   ```

2. **Problemy z SSL**
   ```bash
   # Odnów certyfikat SSL
   sudo certbot renew
   
   # Sprawdź certyfikat
   sudo certbot certificates
   ```

3. **Błędy Google Maps**
   ```bash
   # Sprawdź klucz API w konsoli Google Cloud
   # Upewnij się, że są włączone odpowiednie API:
   # - Maps JavaScript API
   # - Places API
   # - Geocoding API
   ```

4. **Problemy z Docker**
   ```bash
   # Sprawdź status kontenerów
   docker-compose ps
   
   # Sprawdź logi
   docker-compose logs next-app
   docker-compose logs mongodb
   ```

## 🤝 Contributing

1. Fork projektu
2. Stwórz branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest objęty licencją MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 👨‍💻 Autor

**Ambro-Dev** - [GitHub](https://github.com/Ambro-Dev)

## 🙏 Podziękowania

- Next.js team za fantastyczny framework
- Prisma za doskonały ORM
- Radix UI za piękne komponenty
- Google za Maps API
- Wszyscy kontrybutorzy Open Source

## 📞 Wsparcie

Jeśli potrzebujesz pomocy:

1. Sprawdź [dokumentację](./docs/)
2. Otwórz [issue](https://github.com/yourusername/next_gielda/issues)
3. Napisz email: support@fenilo.pl
4. Discord: [Link do serwera]

---

**⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę na GitHub!**
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