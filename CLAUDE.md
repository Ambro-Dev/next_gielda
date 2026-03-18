# CLAUDE.md – Kontekst projektu next_gielda (Fenilo.pl)

## Czym jest ten projekt?

Nowoczesna platforma giełdy transportowej (Fenilo.pl) – umożliwia tworzenie zleceń transportowych, składanie ofert, komunikację w czasie rzeczywistym (Socket.io), zarządzanie użytkownikami i szkołami. Posiada panel administracyjny, integrację z Google Maps, wizualizacje 3D pojazdów (Three.js) oraz generowanie dokumentów PDF.

## Stack technologiczny

| Warstwa        | Technologia                                                  |
|----------------|--------------------------------------------------------------|
| Framework      | **Next.js 15** (App Router) + **TypeScript**                 |
| Styling        | **Tailwind CSS 3** + Radix UI + DaisyUI + Framer Motion      |
| State          | TanStack React Query v4                                      |
| Formularze     | React Hook Form + **Zod** (walidacja)                        |
| Baza danych    | **MongoDB** (replica set) + **Prisma ORM 5**                 |
| Autoryzacja    | **NextAuth.js v5** (beta 30) — plik `auth.ts` w root         |
| Real-time      | **Socket.io** (WebSocket)                                    |
| 3D             | Three.js + React Three Fiber / Drei / Cannon                 |
| Upload         | UploadThing                                                  |
| Email          | Nodemailer                                                   |
| DevOps         | Docker + Docker Compose + Nginx + Let's Encrypt              |

## Komendy

```bash
# Rozwój
npm run dev              # serwer deweloperski (next dev)
npm run build            # prisma generate && next build
npm run lint             # ESLint

# Baza danych / admin
npm run setup:db         # konfiguracja bazy
npm run setup:admin      # tworzenie konta admina (interaktywnie)
npm run setup:admin:env  # tworzenie admina z .env
npm run test:admin       # test konta admina

# Produkcja
npm run build:prod       # build z NODE_ENV=production
npm run start:prod       # start produkcyjny
npm run init:prod        # pełna inicjalizacja produkcyjna
```

## Struktura projektu

```
next_gielda/
├── app/
│   ├── (private)/          # Chronione strony (auth required)
│   │   ├── admin/          # Panel administratora
│   │   ├── transport/      # Giełda transportowa
│   │   ├── user/           # Panel użytkownika
│   │   ├── vehicles/       # Zarządzanie pojazdami
│   │   └── documents/      # Dokumenty i szablony
│   ├── (public)/           # Strony publiczne
│   │   ├── (auth)/         # Login / Register
│   │   └── privacy-policy/
│   ├── api/                # API Routes (~66 plików)
│   ├── context/            # React Context providers
│   ├── lib/                # Helpery (app-level)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Globalne style
├── components/             # ~84 komponenty React
│   ├── ui/                 # Bazowe komponenty UI (shadcn-style)
│   ├── dashboard/          # Komponenty dashboardu
│   └── models/             # Modele 3D
├── lib/                    # Biblioteki narzędziowe
├── prisma/schema.prisma    # Schema bazy danych (MongoDB)
├── scripts/                # Skrypty setup/admin/deploy
├── utils/                  # Funkcje pomocnicze
├── auth.ts                 # Konfiguracja NextAuth v5
├── server.js / server.prod.js  # Custom server (Socket.io)
├── types.ts                # Globalne typy
├── next.config.js          # Konfiguracja Next.js (dev)
├── next.config.prod.js     # Konfiguracja Next.js (prod)
├── tailwind.config.ts      # Konfiguracja Tailwind CSS
├── Dockerfile              # Docker config
├── docker-compose.yml      # Produkcja
├── docker-compose.dev.yml  # Rozwój
└── nginx.conf              # Konfiguracja Nginx proxy
```

## Modele bazy danych (Prisma / MongoDB)

Główne modele zdefiniowane w `prisma/schema.prisma`:

- **User** – role: `admin`, `school_admin`, `user`, `student`; logowanie przez `username` + `hashedPassword`
- **Transport** – zlecenie transportowe z `category`, `vehicle`, `directions`, trasą (polyline), datami wysyłki/odbioru
- **Offer** – oferta na transport z ceną (netto/brutto/VAT), walutą (PLN/EUR/USD)
- **Conversation / Message** – komunikacja w czasie rzeczywistym
- **School / Student** – system integracji szkolnej
- **Category / Vehicle** – typy transportu i pojazdów
- **Directions** – współrzędne start/koniec trasy
- **Object** – przedmioty w transporcie (wymiary + waga)
- **UsersVehicles** – pojazdy użytkowników z typem (`VehicleType` enum)
- **Files** – pliki dołączone do ofert (UploadThing)
- **Report** – raporty/zgłoszenia użytkowników

## Konwencje

- **Aliasy importu**: `@/*` → root projektu (np. `@/components/ui/button`)
- **Komponenty UI**: bazowe w `components/ui/` (styl shadcn/ui – Radix + CVA + clsx + tailwind-merge)
- **API Routes**: `app/api/…/route.ts` (Next.js App Router)
- **Walidacja**: Zod – schematy do formularzy i API
- **Język projektu**: nazwy zmiennych/kodu po angielsku, UI/README po polsku
- **Custom Server**: `server.js` (dev) / `server.prod.js` (prod) – potrzebny dla Socket.io
- **TypeScript strict mode**: włączony w `tsconfig.json`

## Zmienne środowiskowe

Kluczowe zmienne (patrz `.env.example`):

- `DATABASE_URL` – MongoDB connection string (replica set)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` – NextAuth config
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` – Google Maps
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` – UploadThing
- `EMAIL_SERVER_*` – SMTP config (Nodemailer)
- `ADMIN_*` – dane do automatycznego tworzenia admina

## Git Workflow

- Branch naming: `feature/`, `bugfix/`, `docs/` + krótki opis (np. `feature/oauth-login`)
- PR-y tworzymy na branch `master`
- Przed commitem ZAWSZE uruchom: `npm run lint && npx tsc --noEmit`
- Commit messages po angielsku, krótkie i opisowe
- Nie commituj zmian w `.env*`, `secrets/`, certyfikatach SSL

## Review Checklist (przed commitem)

1. TypeScript kompiluje się: `npx tsc --noEmit`
2. Linting przechodzi: `npm run lint`
3. Brak hardcoded secrets w kodzie
4. API routes walidują input (Zod schemas)
5. Zmiany w schema Prisma udokumentowane
6. Autoryzacja sprawdzona w chronionych endpointach

## Uwagi dla AI

- Prisma wymaga MongoDB **z replica set** (nawet w dev)
- NextAuth v5 (beta) — API różni się od v4; konfiguracja w `auth.ts` w root (nie w `pages/api/auth/`)
- Projekt korzysta zarówno z `app/` (App Router) jak i `pages/` (legacy API – `pages/api/` zawiera uploadthing i Pusher)
- Socket.io wymaga custom servera – nie wbudowany w Next.js
- `tansportId` w modelu `Object` to celowy typo w schemacie (nie poprawiać bez migracji!)
- Build wymaga dostępnego `DATABASE_URL` (Prisma generate)
