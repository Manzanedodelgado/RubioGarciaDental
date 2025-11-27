# 🔐 SEGURIDAD

## Variables de Entorno

NUNCA commitees archivos .env al repositorio.

### Configuración

1. Copiar plantilla: `cp .env.example .env.local`
2. Generar secretos: `node scripts/generate-secrets.js`
3. Completar .env.local con valores reales
4. Validar: `node scripts/validate-env.js`

### Supabase

Regenerar keys en: https://app.supabase.com/project/yztiavcffuwdhkhhxypb/settings/api

### Reportar Vulnerabilidades

Email: info@rubiogarciadental.com
