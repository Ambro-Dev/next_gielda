---
paths:
  - "prisma/**"
  - "app/api/**/*.ts"
  - "lib/**/*.ts"
---
# Konwencje bazy danych (Prisma + MongoDB)

- Schema: `prisma/schema.prisma` — MongoDB z replica set
- UWAGA: `tansportId` w modelu `Object` to celowy typo — NIE poprawiaj bez migracji!
- Używaj `@unique` i `@index` dla optymalizacji zapytań
- Relacje muszą być jawnie zdefiniowane
- Build wymaga dostępnego `DATABASE_URL` (Prisma generate)
- Po zmianach schema: `npx prisma generate` + `npx prisma validate`