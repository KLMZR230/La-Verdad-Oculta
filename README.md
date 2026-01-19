# La Verdad Oculta

Una plataforma elegante de publicación de contenido editorial sobre espiritualidad y filosofía.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e)

## 🌟 Características

- **Sitio Público**
  - Página de inicio con hero animado
  - Listado de artículos con búsqueda, filtros por tags y paginación
  - Vista de artículo con tabla de contenidos automática
  - Páginas estáticas (Manifiesto, Acerca, Contacto)
  - Formulario de contacto con rate limiting
  - Modo oscuro/claro

- **Panel de Administración** (`/admin`)
  - Dashboard con métricas
  - CRUD completo de artículos con editor TipTap
  - Autoguardado de borradores
  - Biblioteca de medios con subida a Supabase Storage
  - Gestión de páginas estáticas

- **Seguridad**
  - Autenticación con Supabase Auth
  - Row Level Security (RLS) en todas las tablas
  - Roles: admin, editor, público
  - Protección XSS con DOMPurify
  - Rate limiting en formulario de contacto
  - Headers de seguridad (X-Frame-Options, X-XSS-Protection, etc.)

- **SEO y Rendimiento**
  - Meta tags y Open Graph
  - Sitemap dinámico
  - Robots.txt
  - Imágenes optimizadas
  - Tipografía legible con @tailwindcss/typography

## 📋 Requisitos

- Node.js 18+
- npm o pnpm
- Cuenta de Supabase

## 🚀 Instalación

### 1. Clonar e instalar dependencias

```bash
cd "La Verdad Oculta"
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)

2. Ve a **SQL Editor** y ejecuta las migraciones en orden:
   ```
   supabase/migrations/001_schema.sql
   supabase/migrations/002_rls_policies.sql
   supabase/migrations/003_storage_policies.sql
   ```

3. Ve a **Storage** y crea un bucket llamado `media`:
   - Nombre: `media`
   - Público: ✅ Sí

4. Copia las credenciales de **Settings > API**

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Crear usuario admin

En Supabase Dashboard:

1. Ve a **Authentication > Users**
2. Click **Add user** y crea un usuario con email/password
3. Copia el UUID del usuario
4. Ve a **SQL Editor** y ejecuta:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('tu-user-uuid', 'admin');
   ```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🧪 Tests

### Unit tests
```bash
npm run test
```

### E2E tests
```bash
npm run test:e2e
```

## 📦 Deploy

### Vercel

1. Conecta tu repositorio a [vercel.com](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de entorno en producción

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## 📁 Estructura del proyecto

```
├── supabase/
│   └── migrations/          # SQL para schema y policies
├── src/
│   ├── app/
│   │   ├── admin/           # Panel de administración
│   │   ├── articulos/       # Listado y detalle de artículos
│   │   ├── manifiesto/      # Página de manifiesto
│   │   ├── acerca/          # Página sobre nosotros
│   │   ├── contacto/        # Formulario de contacto
│   │   ├── login/           # Inicio de sesión
│   │   ├── actions/         # Server actions
│   │   ├── sitemap.ts       # Sitemap dinámico
│   │   └── robots.ts        # Robots.txt
│   ├── components/
│   │   ├── admin/           # Componentes del admin
│   │   ├── articles/        # Componentes de artículos
│   │   ├── auth/            # Login form
│   │   ├── contact/         # Contact form
│   │   ├── layout/          # Header, Footer
│   │   ├── providers/       # Theme provider
│   │   └── ui/              # Componentes UI
│   └── lib/
│       ├── supabase/        # Clientes Supabase
│       ├── utils/           # Utilidades
│       └── types.ts         # TypeScript types
├── __tests__/               # Unit tests
├── e2e/                     # E2E tests
└── public/                  # Assets estáticos
```

## 🔒 Checklist de Seguridad

- [x] **RLS habilitado** en todas las tablas
- [x] **Service role key** solo en servidor (nunca en cliente)
- [x] **Sanitización HTML** con DOMPurify
- [x] **Rate limiting** en formulario de contacto
- [x] **Headers de seguridad** configurados en next.config.mjs
- [x] **Middleware de autenticación** para rutas `/admin/*`
- [x] **Verificación de roles** antes de operaciones sensibles
- [x] **URLs sanitizadas** para prevenir javascript: y data:
- [x] **Validación de entrada** en formularios
- [ ] Configurar **CORS** en producción (Supabase Dashboard)
- [ ] Habilitar **2FA** para cuentas admin
- [ ] Revisar **logs de acceso** regularmente

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

> *"Este sitio es una propuesta filosófica/espiritual personal."*
