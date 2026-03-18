---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
# Konwencje TypeScript

- Strict mode jest włączony — nie używaj `any`, preferuj `unknown` z type guards
- Importy typów: `import type { Foo } from 'bar'`
- Aliasy: `@/*` → root projektu (np. `@/components/ui/button`)
- Komponenty UI bazowe w `components/ui/` — styl shadcn/ui (Radix + CVA + clsx + tailwind-merge)
- Nazwy zmiennych i kodu po angielsku, UI po polsku
- Walidacja danych: zawsze Zod