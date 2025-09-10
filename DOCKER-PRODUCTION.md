# Docker Compose Production Deployment Guide

Przewodnik krok po kroku do uruchomienia aplikacji Next.js Gielda Transport w Docker Compose na produkcji.

## 🚀 Szybki Start

### Automatyczne Uruchomienie

```bash
# Uruchom skrypt konfiguracyjny
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

Skrypt automatycznie:
1. Sprawdzi instalację Docker
2. Pobierze konfigurację (domena, email)
3. Utworzy plik środowiskowy
4. Zbuduje i uruchomi kontenery
5. Skonfiguruje bazę danych i użytkownika admin
6. Opcjonalnie skonfiguruje certyfikat SSL

### Ręczne Uruchomienie

#### 1. Przygotowanie Środowiska

```bash
# Skopiuj plik środowiskowy
cp env.docker .env

# Edytuj zmienne środowiskowe
nano .env
```

#### 2. Konfiguracja Zmiennych Środowiskowych

Zaktualizuj plik `.env`:

```env
# Konfiguracja bazy danych
DATABASE_URL="mongodb://mongo:27017/next_gielda"
MONGO_ROOT_USERNAME="admin"
MONGO_ROOT_PASSWORD="twoje-haslo-mongo"

# Konfiguracja NextAuth
NEXTAUTH_URL="https://twoja-domena.com"
NEXTAUTH_SECRET="twoj-sekret-nextauth"
NEXTAUTH_PUBLIC_SITE_URL="https://twoja-domena.com"

# Konfiguracja serwera
NEXT_PUBLIC_SERVER_URL="https://twoja-domena.com"
NODE_ENV="production"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="twoj-klucz-google-maps"

# Konfiguracja email
EMAIL_SERVER="smtp://uzytkownik:haslo@smtp.gmail.com:587"
EMAIL_FROM="noreply@twoja-domena.com"

# UploadThing (opcjonalne)
UPLOADTHING_SECRET="twoj-sekret-uploadthing"
UPLOADTHING_APP_ID="twoj-app-id-uploadthing"

# Socket.io
SOCKET_IO_PORT="3001"
```

#### 3. Utworzenie Katalogów

```bash
mkdir -p uploads logs/nginx backups ssl
```

#### 4. Uruchomienie Aplikacji

```bash
# Zbuduj i uruchom kontenery
docker-compose -f docker-compose.prod.yml up -d

# Sprawdź status
docker-compose -f docker-compose.prod.yml ps
```

#### 5. Inicjalizacja Bazy Danych

```bash
# Utwórz użytkownika admin i skonfiguruj bazę danych
docker-compose -f docker-compose.prod.yml exec app node scripts/init-production.js
```

## 🔧 Zarządzanie Aplikacją

### Podstawowe Komendy

```bash
# Uruchomienie
docker-compose -f docker-compose.prod.yml up -d

# Zatrzymanie
docker-compose -f docker-compose.prod.yml down

# Restart
docker-compose -f docker-compose.prod.yml restart

# Aktualizacja
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Wyświetlenie logów
docker-compose -f docker-compose.prod.yml logs -f

# Wyświetlenie logów konkretnego serwisu
docker-compose -f docker-compose.prod.yml logs -f app
```

### Zarządzanie Bazą Danych

```bash
# Połączenie z MongoDB
docker-compose -f docker-compose.prod.yml exec mongo mongosh

# Backup bazy danych
docker-compose -f docker-compose.prod.yml exec mongo mongodump --db next_gielda --out /backups/$(date +%Y%m%d_%H%M%S)

# Przywrócenie z backupu
docker-compose -f docker-compose.prod.yml exec mongo mongorestore --db next_gielda /backups/20231201_120000/next_gielda
```

### Zarządzanie Użytkownikami Admin

```bash
# Utworzenie nowego użytkownika admin
docker-compose -f docker-compose.prod.yml exec app node scripts/create-admin.js

# Test konfiguracji admin
docker-compose -f docker-compose.prod.yml exec app node scripts/test-admin.js
```

## 🔒 Konfiguracja SSL

### Automatyczna Konfiguracja (Let's Encrypt)

```bash
# Zatrzymaj nginx
docker-compose -f docker-compose.prod.yml stop nginx

# Uzyskaj certyfikat
sudo certbot certonly --standalone -d twoja-domena.com --email twoj-email@example.com --agree-tos

# Skopiuj certyfikaty
sudo cp /etc/letsencrypt/live/twoja-domena.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/twoja-domena.com/privkey.pem ssl/key.pem
sudo chown $(id -u):$(id -g) ssl/cert.pem ssl/key.pem

# Uruchom nginx ponownie
docker-compose -f docker-compose.prod.yml start nginx
```

### Ręczna Konfiguracja SSL

1. Umieść swoje certyfikaty w katalogu `ssl/`:
   - `ssl/cert.pem` - certyfikat
   - `ssl/key.pem` - klucz prywatny

2. Zaktualizuj `nginx.conf` aby włączyć HTTPS

## 📊 Monitorowanie

### Sprawdzanie Statusu

```bash
# Status wszystkich kontenerów
docker-compose -f docker-compose.prod.yml ps

# Sprawdzenie zdrowia aplikacji
curl https://twoja-domena.com/health

# Sprawdzenie logów
docker-compose -f docker-compose.prod.yml logs --tail=100 app
```

### Metryki i Zasoby

```bash
# Użycie zasobów
docker stats

# Informacje o kontenerach
docker-compose -f docker-compose.prod.yml top
```

## 🔄 Aktualizacje

### Aktualizacja Aplikacji

```bash
# 1. Zatrzymaj aplikację
docker-compose -f docker-compose.prod.yml down

# 2. Pobierz najnowsze zmiany
git pull

# 3. Zbuduj nowy obraz
docker-compose -f docker-compose.prod.yml build --no-cache

# 4. Uruchom aplikację
docker-compose -f docker-compose.prod.yml up -d

# 5. Sprawdź status
docker-compose -f docker-compose.prod.yml ps
```

### Aktualizacja Bazy Danych

```bash
# Uruchom migracje Prisma
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
```

## 🚨 Rozwiązywanie Problemów

### Częste Problemy

#### Aplikacja nie uruchamia się
```bash
# Sprawdź logi
docker-compose -f docker-compose.prod.yml logs app

# Sprawdź zmienne środowiskowe
docker-compose -f docker-compose.prod.yml config

# Restart kontenera
docker-compose -f docker-compose.prod.yml restart app
```

#### Problemy z bazą danych
```bash
# Sprawdź status MongoDB
docker-compose -f docker-compose.prod.yml logs mongo

# Sprawdź połączenie
docker-compose -f docker-compose.prod.yml exec app node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$queryRaw\`SELECT 1\`.then(() => console.log('Connected')).catch(console.error).finally(() => prisma.\$disconnect());"
```

#### Problemy z Nginx
```bash
# Sprawdź konfigurację
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Sprawdź logi
docker-compose -f docker-compose.prod.yml logs nginx
```

### Czyszczenie Systemu

```bash
# Usuń nieużywane obrazy
docker image prune -a

# Usuń nieużywane wolumeny
docker volume prune

# Usuń nieużywane sieci
docker network prune

# Pełne czyszczenie (ostrożnie!)
docker system prune -a
```

## 📋 Checklist Produkcyjny

### Przed Uruchomieniem
- [ ] Skonfigurowano zmienne środowiskowe
- [ ] Ustawiono domenę i DNS
- [ ] Skonfigurowano Google Maps API
- [ ] Skonfigurowano serwer email
- [ ] Utworzono katalogi (uploads, logs, backups, ssl)

### Po Uruchomieniu
- [ ] Aplikacja odpowiada na https://twoja-domena.com
- [ ] Panel admin dostępny na https://twoja-domena.com/admin
- [ ] Health check działa: https://twoja-domena.com/health
- [ ] Baza danych połączona i skonfigurowana
- [ ] Użytkownik admin utworzony
- [ ] SSL certyfikat skonfigurowany
- [ ] Logi są zapisywane poprawnie

### Bezpieczeństwo
- [ ] Zmieniono domyślne hasła
- [ ] Skonfigurowano firewall
- [ ] Włączono HTTPS
- [ ] Skonfigurowano backup bazy danych
- [ ] Sprawdzono uprawnienia plików

## 🔧 Konfiguracja Zaawansowana

### Niestandardowa Konfiguracja Nginx

Możesz dostosować `nginx.conf` dla swoich potrzeb:

```nginx
# Dodaj niestandardowe nagłówki bezpieczeństwa
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# Konfiguracja rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### Skalowanie Poziome

Aby skalować aplikację:

```bash
# Zwiększ liczbę instancji aplikacji
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Monitoring z Prometheus

Możesz dodać monitoring Prometheus do `docker-compose.prod.yml`:

```yaml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - gielda-network
```

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi: `docker-compose -f docker-compose.prod.yml logs -f`
2. Sprawdź status: `docker-compose -f docker-compose.prod.yml ps`
3. Sprawdź konfigurację: `docker-compose -f docker-compose.prod.yml config`
4. Sprawdź dokumentację: [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)

---

**Uwaga**: Ten przewodnik zakłada podstawową znajomość Docker i Docker Compose. Zawsze testuj w środowisku deweloperskim przed wdrożeniem na produkcję.
