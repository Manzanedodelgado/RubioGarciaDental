# Guía de Despliegue - Rubio García Dental

## 🎯 Sistema de Gestión Clínica Completo

### 📦 Contenido del Paquete

El sistema incluye:

- **Dashboard principal** con métricas en tiempo real
- **Gestión de pacientes** con fichas completas
- **Agenda clínica** con citas y tratamientos
- **Historias clínicas** con odontogramas interactivos
- **Gestión de facturas** y contabilidad
- **Sistema de mensajería** (Email/WhatsApp)
- **🤖 Widget IA Conversacional** con control por voz
- **Módulos de IA** con automatizaciones
- **Configuración del sistema** y usuarios

### 🛠️ Requisitos Técnicos

- **Node.js 20.9.0 o superior**
- **npm** o **pnpm**
- **Cuenta de Supabase** (base de datos)
- **Credenciales de Gmail** (API OAuth2)
- **Cuenta de WhatsApp Business** (opcional)

### 📋 Pasos de Instalación

#### 1. Preparar el Entorno

```bash
# Verificar versión de Node.js
node --version

# Si es inferior a 20.9.0, actualizar Node.js
# Descargar desde: https://nodejs.org/

# Instalar dependencias
npm install
```

#### 2. Configurar Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yztiavcffuwdhkhhxypb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dGlhdmNmZnV3ZGhraGh4eXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzgwNjQsImV4cCI6MjA3OTQxNDA2NH0.IkFuXpNi7-lhjkCuOLjOMgm5NEj8OpdvqVA1REBZqNM
SUPABASE_SERVICE_ROLE_KEY=sb_secret_v2-zpnJxrWcPNJZjjRsgyQ_8lzVxBe-

# Gmail API Configuration
NEXT_PUBLIC_GOOGLE_MAIL_CLIENT_ID=${GOOGLE_MAIL_CLIENT_ID}
GOOGLE_MAIL_CLIENT_SECRET=${GOOGLE_MAIL_CLIENT_SECRET}
GOOGLE_MAIL_REFRESH_TOKEN=${GOOGLE_MAIL_REFRESH_TOKEN}

# SQL Server Configuration
SQLSERVER_HOST=gabinete2\INFOMED
SQLSERVER_DATABASE=GELITE
SQLSERVER_USER=RUBIOGARCIADENTAL
SQLSERVER_PASSWORD=666666

# Application Configuration
ADMIN_EMAIL=info@rubiogarciadental.com
COMPANY_NAME=TRIDENTAL ODONTOLOGOS SLP
COMPANY_NIF=B88393764
```

#### 3. Configurar Base de Datos

Ejecutar los scripts SQL en orden en la base de datos Supabase:

```bash
# 1. Estructura básica
database/schema_pacientes.sql
database/schema_configuracion.sql
database/schema_ai.sql

# 2. Funcionalidades avanzadas
database/schema_historia_clinica.sql
database/schema_gestion_facturas.sql
database/schema_contabilidad.sql
database/schema_whatsapp.sql
```

#### 4. Compilar y Desplegar

```bash
# Compilar la aplicación
npm run build

# Modo desarrollo (para pruebas)
npm run dev

# Modo producción (después del build)
npm start
```

### 🌐 Despliegue en Producción

#### Opción 1: Vercel (Recomendado)

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Sistema de gestión clínica Rubio García Dental"
   git remote add origin https://github.com/tu-usuario/rubio-garcia-dental.git
   git push -u origin main
   ```

2. **Conectar con Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Importar proyecto desde GitHub
   - Configurar variables de entorno
   - Desplegar automáticamente

#### Opción 2: Servidor Propio

```bash
# En el servidor con Node.js 20+
git clone https://github.com/tu-usuario/rubio-garcia-dental.git
cd rubio-garcia-dental
npm install
npm run build
npm start

# Usar PM2 para gestión de procesos
npm install -g pm2
pm2 start npm --name "rubio-dental" -- start
pm2 save
pm2 startup
```

### 🎯 Widget IA Conversacional

#### Funcionalidades del Widget

El widget permite control por voz y texto para:

- **Crear citas:** "Crea una cita para Manuel Rodriguez el 17 de diciembre para una reconstrucción"
- **Enviar mensajes:** "Manda un mensaje a María García preguntando si puede venir a las 16:30h"
- **Consultar citas:** "¿Qué día tiene cita Carmen Pardo?"
- **Buscar pacientes:** "Busca pacientes con apellido García"
- **Consultar disponibilidad:** "¿Qué horas tienes libres mañana?"

#### Tratamientos Soportados (18 tipos)

| Tratamiento | Duración |
|-------------|----------|
| Control | 15 min |
| Urgencia | 15 min |
| Prótesis Fija | 30 min |
| Cirugía/Injerto | 60 min |
| Retirar Ortodoncia | 30 min |
| Prótesis Removible | 15 min |
| Colocación Ortodoncia | 30 min |
| Periodoncia | 30 min |
| Cirugía de Implante | 60 min |
| Mensualidad Ortodoncia | 15 min |
| Ajuste Prot/tto | 30 min |
| Primera Visita | 15 min |
| Higiene Dental | 15 min |
| Endodoncia | 45 min |
| Reconstrucción | 30 min |
| Exodoncia | 30 min |
| Estudio Ortodoncia | 15 min |
| Rx/escáner | 15 min |

#### Rutas del Widget

- **Widget principal:** `/ia/widget-conversacional/`
- **Pruebas de comandos:** `/ia/pruebas-comandos/`

### 📱 Acceso al Sistema

Una vez desplegado, acceder a:

- **Login:** `/acceso/login`
- **Dashboard:** `/dashboard`
- **Pacientes:** `/clinica/pacientes`
- **Agenda:** `/clinica/agenda`
- **Historia Clínica:** `/clinica/historia-clinica`
- **Facturas:** `/gestion/facturas`
- **Contabilidad:** `/gestion/contabilidad`
- **Mensajería:** `/mensajeria/mail` y `/mensajeria/whatsapp`
- **Configuración:** `/configuracion`

### 🔧 Soporte y Mantenimiento

#### Logs del Sistema

```bash
# Ver logs en desarrollo
npm run dev

# Ver logs en producción (PM2)
pm2 logs rubio-dental

# Ver logs de errores específicos
pm2 logs rubio-dental --err
```

#### Backup de Datos

```bash
# Backup manual de Supabase
# Usar el dashboard de Supabase o herramientas como pg_dump

# Backup automático programado
# Configurar en cron jobs del servidor
```

#### Actualizaciones

```bash
# Actualizar dependencias
npm update

# Rebuild después de cambios
npm run build

# Reiniciar servicios
pm2 restart rubio-dental
```

### 🚨 Solución de Problemas Comunes

#### Error: "Node.js version not supported"
- Actualizar Node.js a versión 20.9.0 o superior
- Usar nvm para gestionar versiones: `nvm install 20 && nvm use 20`

#### Error: "Module not found"
- Reinstalar dependencias: `rm -rf node_modules && npm install`
- Verificar variables de entorno

#### Error: "Database connection failed"
- Verificar credenciales de Supabase
- Comprobar que la base de datos esté accesible

#### Error: "Gmail API not working"
- Verificar credenciales OAuth2
- Comprobar que el refresh token esté válido

### 📞 Contacto

Para soporte técnico o consultas:
- **Email:** info@rubiogarciadental.com
- **Empresa:** TRIDENTAL ODONTOLOGOS SLP
- **NIF:** B88393764

---

## 🎉 ¡Sistema Listo!

El sistema está completamente funcional y listo para transformar la gestión de tu clínica dental. Incluye todas las funcionalidades modernas que necesitas para operar de manera eficiente y profesional.

**Funcionalidades destacadas:**
- ✅ Dashboard en tiempo real
- ✅ Gestión completa de pacientes
- ✅ Sistema de citas y agenda
- ✅ Historia clínica digital
- ✅ Facturación y contabilidad
- ✅ Mensajería automatizada
- ✅ **Widget IA con control por voz**
- ✅ Automatizaciones inteligentes
- ✅ Interfaz moderna y responsive

**¡Disfruta de tu nuevo sistema de gestión clínica!** 🚀
