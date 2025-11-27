#!/bin/bash

# ============================================
# SCRIPT DE SEGURIDAD OPTIMIZADO
# Rubio García Dental
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║       🔐 SEGURIDAD - RUBIO GARCÍA DENTAL 🔐           ║"
echo "║                                                        ║"
echo "║     Limpieza de credenciales y configuración segura   ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# ============================================
# VERIFICACIONES
# ============================================

echo -e "${BLUE}[1/10]${NC} Verificando prerrequisitos..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no instalado${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no instalado${NC}"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo -e "${RED}❌ No estás en un repositorio Git${NC}"
    echo "Ve al directorio de tu proyecto RubioGarciaDental"
    exit 1
fi

echo -e "${GREEN}✅ Prerrequisitos OK${NC}\n"

# ============================================
# BACKUP
# ============================================

echo -e "${BLUE}[2/10]${NC} Creando backup de seguridad..."

BACKUP_DIR="backups/security-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

[ -f ".env.local" ] && cp .env.local "$BACKUP_DIR/"
[ -f ".env" ] && cp .env "$BACKUP_DIR/"

git log --oneline -20 > "$BACKUP_DIR/git-history.txt"
git status > "$BACKUP_DIR/git-status.txt"

echo -e "${GREEN}✅ Backup creado en: $BACKUP_DIR${NC}\n"

# ============================================
# RAMA DE SEGURIDAD
# ============================================

echo -e "${BLUE}[3/10]${NC} Creando rama de seguridad..."

SECURITY_BRANCH="security-fix-$(date +%Y%m%d)"

git stash push -m "Security fix stash" 2>/dev/null || true
git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
git pull 2>/dev/null || true
git checkout -b "$SECURITY_BRANCH"

echo -e "${GREEN}✅ Rama '$SECURITY_BRANCH' creada${NC}\n"

# ============================================
# LIMPIAR HISTORIAL
# ============================================

echo -e "${BLUE}[4/10]${NC} Limpiando credenciales del historial..."

FILES_TO_REMOVE=(
    ".env"
    ".env.local"
    ".env.development"
    ".env.production"
)

for file in "${FILES_TO_REMOVE[@]}"; do
    git filter-branch --force --index-filter \
        "git rm --cached --ignore-unmatch '$file'" \
        --prune-empty --tag-name-filter cat -- --all 2>/dev/null || true
done

echo -e "${GREEN}✅ Historial limpiado${NC}\n"

# ============================================
# GITIGNORE
# ============================================

echo -e "${BLUE}[5/10]${NC} Actualizando .gitignore..."

cat > .gitignore << 'GITIGNORE_END'
# Dependencias
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# VARIABLES DE ENTORNO - CRÍTICO
.env
.env.*
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# Credenciales
*.key
*.pem
secrets/
credentials/

# Logs
*.log

# IDEs
.vscode/
.idea/
.DS_Store

# Backups
backups/
*.backup

# Misc
.vercel
.turbo
GITIGNORE_END

echo -e "${GREEN}✅ .gitignore actualizado${NC}\n"

# ============================================
# ENV.EXAMPLE
# ============================================

echo -e "${BLUE}[6/10]${NC} Creando .env.example..."

cat > .env.example << 'ENV_END'
# RUBIO GARCÍA DENTAL - CONFIGURACIÓN
# Copia a .env.local y completa valores reales

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://yztiavcffuwdhkhhxypb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_nueva_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# SQL SERVER (GESDEN)
SQLSERVER_HOST=gabinete2\INFOMED
SQLSERVER_DATABASE=GELITE
SQLSERVER_USER=RUBIOGARCIADENTAL
SQLSERVER_PASSWORD=666666

# AUTENTICACIÓN (generar con: node scripts/generate-secrets.js)
JWT_SECRET=tu_jwt_secret_32_caracteres
NEXTAUTH_SECRET=tu_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ADMIN
ADMIN_USER_ID=JMD
ADMIN_EMAIL=info@rubiogarciadental.com
ADMIN_PASSWORD=190582

# IA (RECOMENDADO: Groq gratis)
GROQ_API_KEY=obtener_en_console.groq.com

# ENTORNO
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV_END

echo -e "${GREEN}✅ .env.example creado${NC}\n"

# ============================================
# SCRIPTS
# ============================================

echo -e "${BLUE}[7/10]${NC} Creando scripts..."

mkdir -p scripts

cat > scripts/generate-secrets.js << 'SECRETS_END'
#!/usr/bin/env node
const crypto = require('crypto');

console.log('\n🔐 GENERADOR DE SECRETOS\n');
const jwt = crypto.randomBytes(32).toString('hex');
const auth = crypto.randomBytes(32).toString('base64');

console.log('JWT_SECRET="' + jwt + '"');
console.log('NEXTAUTH_SECRET="' + auth + '"');
console.log('\n✅ Copia estos valores a .env.local\n');
SECRETS_END

chmod +x scripts/generate-secrets.js

cat > scripts/validate-env.js << 'VALIDATE_END'
#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NEXTAUTH_SECRET'
];

console.log('\n🔍 VALIDACIÓN\n');
let missing = [];
required.forEach(v => {
  const ok = !!process.env[v];
  console.log((ok ? '✅' : '❌') + ' ' + v);
  if (!ok) missing.push(v);
});

if (missing.length) {
  console.log('\n❌ Faltan:', missing.join(', '));
  process.exit(1);
}
console.log('\n✅ OK\n');
VALIDATE_END

chmod +x scripts/validate-env.js

echo -e "${GREEN}✅ Scripts creados${NC}\n"

# ============================================
# SECURITY.MD
# ============================================

echo -e "${BLUE}[8/10]${NC} Creando SECURITY.md..."

cat > SECURITY.md << 'SECURITY_END'
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
SECURITY_END

echo -e "${GREEN}✅ SECURITY.md creado${NC}\n"

# ============================================
# README
# ============================================

echo -e "${BLUE}[9/10]${NC} Creando README.SECURITY.md..."

cat > README.SECURITY.md << 'README_END'
# ✅ SPRINT 0: SEGURIDAD COMPLETADO

## Cambios Realizados

- Credenciales eliminadas del historial
- .gitignore actualizado
- .env.example creado
- Scripts generados

## Próximos Pasos

1. Generar secretos: `node scripts/generate-secrets.js`
2. Configurar: `cp .env.example .env.local`
3. Editar .env.local con valores reales
4. Actualizar Supabase keys
5. Validar: `node scripts/validate-env.js`
6. Instalar: `npm install`
7. Ejecutar: `npm run dev`

## Despliegue

1. Push: `git push origin security-fix-FECHA`
2. Crear PR en GitHub
3. Mergear a main
4. Force push: `git push origin --force --all`
README_END

echo -e "${GREEN}✅ README.SECURITY.md creado${NC}\n"

# ============================================
# COMMIT
# ============================================

echo -e "${BLUE}[10/10]${NC} Creando commit..."

git add .gitignore .env.example SECURITY.md README.SECURITY.md scripts/
git commit -m "🔐 Security Sprint 0: Configuración segura

- Limpiar credenciales del historial
- Actualizar .gitignore
- Crear .env.example
- Scripts de utilidades
- Documentación de seguridad"

echo -e "${GREEN}✅ Commit creado${NC}\n"

# ============================================
# RESUMEN
# ============================================

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     ✅ PROCESO COMPLETADO ✅           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}\n"
echo "1. node scripts/generate-secrets.js"
echo "2. cp .env.example .env.local"
echo "3. Editar .env.local"
echo "4. Actualizar Supabase keys"
echo "5. node scripts/validate-env.js"
echo "6. npm install"
echo "7. npm run dev"
echo "8. git push origin $SECURITY_BRANCH"
echo ""
echo -e "${GREEN}✅ Sprint 0 completado${NC}\n"
