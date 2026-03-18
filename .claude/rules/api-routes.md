---
paths:
  - "app/api/**/*.ts"
---
# Konwencje API Routes

- Waliduj input za pomocą Zod schemas
- Sprawdzaj autoryzację: `const session = await auth()` z `@/auth`
- Używaj `NextResponse.json()` do odpowiedzi
- Obsługuj błędy z odpowiednimi kodami HTTP (400, 401, 403, 404, 500)
- Nigdy nie zwracaj wrażliwych danych (hashedPassword, secrets)
- NextAuth v5 beta — API różni się od v4