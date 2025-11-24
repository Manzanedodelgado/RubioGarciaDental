# 🦷 RUBIO GARCÍA DENTAL - Sistema de Gestión Integral

Sistema completo de gestión para clínica dental especializada en **Implantología y Estética de Vanguardia**.

## ✨ Características Principales

### 🎯 Funcionalidades Completadas
- ✅ **Dashboard en tiempo real** con 4 widgets de estado
- ✅ **Agenda completa** con calendario, drag & drop y sincronización SQL Server
- ✅ **Sistema de autenticación** con Supabase Auth
- ✅ **WhatsApp Business** integrado con IA
- ✅ **Servicios de IA** con Ollama
- ✅ **Sincronización bidireccional** con SQL Server 2008
- ✅ **🤖 Widget IA Conversacional** - Control por voz y texto para gestión clínica

### 🚧 En Desarrollo
- 📋 Módulo de Pacientes
- 🦷 Historia Clínica con Odontograma
- 💰 Sistema de Facturas (Verifactu)
- 📧 Integración Gmail
- 🤖 Automatizaciones avanzadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14 + TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Legacy Sync**: SQL Server 2008
- **UI/UX**: Tailwind CSS + Headless UI
- **IA**: Ollama (Local)
- **WhatsApp**: Baileys
- **Tiempo Real**: Supabase Realtime

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- PostgreSQL (Supabase)
- SQL Server 2008
- Ollama (para IA)
- Cuenta de Supabase

### 1. Clonar e Instalar Dependencias
```bash
# Clonar el repositorio
git clone [repository-url]
cd rubio-garcia-dental

# Instalar dependencias
npm install
```

### 2. Configuración de Variables de Entorno
Crear archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yztiavcffuwdhkhhxypb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SQL Server 2008 Legacy
SQLSERVER_HOST=gabinete2\\INFOMED
SQLSERVER_DATABASE=GELITE
SQLSERVER_USER=RUBIOGARCIADENTAL
SQLSERVER_PASSWORD=666666

# WhatsApp Worker
WHATSAPP_WORKER_DB_URL=postgresql://whatsapp_pj7l_user:nGmPrieYrzNXLvJHYQu5JYEqydM15I5I@dpg-d4h1egf5r7bs73bisfog-a.oregon-postgres.render.com/whatsapp_pj7l
WHATSAPP_BAILEYS_HOST=http://192.168.1.34:3001

# LLM/AI
LLM_HOST=http://192.168.1.34:11434

# Gmail API
GOOGLE_MAIL_CLIENT_ID=504307053079-d3hmoj6m8oj4p4h27gnvp6e49nmlf5ic.apps.googleusercontent.com

# Admin
ADMIN_USER_ID=JMD
ADMIN_EMAIL=info@rubiogarciadental.com
ADMIN_PASSWORD=190582
```

### 3. Configuración de Supabase
1. Crear tablas principales (ver `supabase/migrations/`)
2. Configurar RLS (Row Level Security)
3. Habilitar Realtime
4. Configurar Auth

### 4. Configurar SQL Server 2008
1. Habilitar CDC (Change Data Capture)
2. Configurar triggers para sincronización
3. Crear tablas de sincronización

### 5. Ejecutar la Aplicación
```bash
# Modo desarrollo
npm run dev

# Para producción
npm run build
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
rubio-garcia-dental/
├── 📁 app/                    # Next.js 14 App Router
│   ├── 🏠 page.tsx           # Página principal
│   ├── 📊 dashboard/         # Dashboard principal
│   ├── 📅 clinica/agenda/    # Módulo de agenda
│   ├── 👥 clinica/pacientes/ # Módulo de pacientes
│   ├── 💬 mensajeria/        # WhatsApp y correo
│   ├── 🤖 ia/               # Inteligencia artificial
│   │   ├── widget-conversacional/    # Widget IA principal
│   │   ├── pruebas-comandos/         # Suite de pruebas
│   │   ├── agente-ia/               # Chat con IA
│   │   └── control-voz/             # Control por voz
│   ├── 💰 gestion/          # Facturación y contabilidad
│   └── ⚙️ configuracion/    # Configuración del sistema
├── 🧩 components/            # Componentes reutilizables
│   ├── Navigation.tsx       # Navegación lateral
│   ├── AuthProvider.tsx     # Proveedor de autenticación
│   ├── StatusProvider.tsx   # Estado de servicios
│   └── dashboard/           # Componentes del dashboard
├── 🛠️ services/             # Servicios externos
│   ├── supabase.ts          # Cliente Supabase
│   ├── sql-server.ts        # Conexión SQL Server
│   ├── whatsapp.ts          # WhatsApp Business
│   └── ai.ts               # Servicios de IA
├── 📝 types/               # Definiciones TypeScript
├── 🎨 styles/              # Archivos CSS/Tailwind
└── 📊 lib/                 # Utilidades y configuración
```

## 🎯 Módulos Funcionales

### 1. Dashboard Principal
- **4 Widgets de estado**: Agenda, WhatsApp, IA, Automatizaciones
- **Caja de citas del día**: Lista con información expandible
- **Caja de mensajes urgentes**: WhatsApp con IA
- **Acciones rápidas**: Nueva cita, contacto, documento, usuario
- **Actualización en tiempo real**

### 2. Módulo Agenda
- **Calendario completo**: Mes, semana, día
- **Drag & Drop**: Reprogramar citas arrastrando
- **Vista por horas**: Intervalos de 15 minutos
- **Estados modificables**: Programada, confirmada, en curso, etc.
- **Sincronización SQL Server**: Bidireccional automática
- **Filtros**: Por doctor y fecha

### 3. Sistema de Autenticación
- **Supabase Auth**: Autenticación segura
- **Roles**: Admin y User
- **Protección de rutas**: Automática
- **Sesiones persistentes**: Con refresh automático

### 4. Servicios Externos
- **SQL Server 2008**: Sincronización de datos legacy
- **WhatsApp Business**: Baileys para mensajería
- **IA (Ollama)**: Procesamiento local de lenguaje
- **Supabase Realtime**: Actualizaciones en tiempo real

### 5. Widget IA Conversacional ⭐ **NUEVO**
- **🎤 Control por Voz**: Reconocimiento de comandos en español
- **💬 Procesamiento de Texto**: IA para comandos escritos naturales
- **🎯 Comandos Específicos**: Crear citas, enviar mensajes, consultar pacientes
- **📊 Estadísticas en Tiempo Real**: Métricas de uso y rendimiento
- **🔧 Página de Pruebas**: Suite completa de testing automatizada

**Ejemplos de comandos soportados:**
```
"Crea una cita para Manuel Rodriguez Rodriguez el dia 17 de diciembre para una reconstruccion"
"Manda un mensaje a Maria Garcia Toledo preguntándole si puede venir a las 16:30h"
"Qué día tiene cita Carmen Pardo Pardo?"
"Buscar paciente Ana Lopez Garcia"
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno Requeridas
- `NEXT_PUBLIC_SUPABASE_URL`: URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública de Supabase
- `SQLSERVER_HOST`: Host del SQL Server
- `WHATSAPP_BAILEYS_HOST`: Host del servicio WhatsApp
- `LLM_HOST`: Host del servicio Ollama

### Credenciales de Acceso
- **Admin**: info@rubiogarciadental.com / 190582
- **User**: (configurable)

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Variables de Entorno en Producción
- Configurar todas las variables en el hosting
- SSL requerido para Supabase
- CORS configurado correctamente

## 🧪 Testing

### Comandos de Testing
```bash
# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build para verificar errores
npm run build
```

## 🏥 Información de la Clínica

- **Nombre**: Rubio García Dental
- **Especialidad**: Implantología y Estética de Vanguardia
- **Ubicación**: Madrid, España
- **Contacto**: 916 410 841 | 664 218 253
- **Web**: www.rubiogarciadental.com

### Equipo Médico
- **Dr. Mario Rubio García** - Director Clínico e Implantólogo
- **Dra. Virginia Tresgallo** - Ortodoncista
- **Dra. Irene García** - Endodoncista
- **Tc. Juan Antonio Manzanedo** - Higienista Dental

## 📈 Estado del Proyecto

| Módulo | Completado | Estado |
|--------|------------|--------|
| **Dashboard** | 100% | ✅ Funcional |
| **Agenda** | 100% | ✅ Funcional |
| **Autenticación** | 100% | ✅ Funcional |
| **Pacientes** | 10% | 🔧 En desarrollo |
| **Historia Clínica** | 5% | 🔧 En desarrollo |
| **WhatsApp** | 80% | 🔧 Service ready |
| **IA** | 90% | ✅ Service functional |
| **🤖 Widget IA Conversacional** | 100% | ✅ Funcional |
| **Gestión** | 20% | 🔧 Pendiente |

## 🛡️ Seguridad

- **Autenticación**: Supabase Auth con JWT
- **Autorización**: Row Level Security (RLS)
- **Encriptación**: TLS/HTTPS obligatorio
- **Variables de entorno**: Nunca expuestas al cliente
- **SQL Injection**: Protegido con prepared statements

## 🔄 Sincronización de Datos

### SQL Server 2008 → Supabase
- **CDC**: Change Data Capture automático
- **Bidireccional**: Cambios en cualquier sentido
- **Tiempo real**: Supabase Realtime
- **Conflictos**: Resolución automática

### WhatsApp → Agenda
- **Citas automáticas**: Desde mensajes de booking
- **Contactos automáticos**: Creación desde mensajes
- **Alertas urgentes**: Detección con IA

## 🤖 Inteligencia Artificial

### Ollama Local
- **Modelos**: LLaMA 3, CodeLlama
- **Chat inteligente**: Para pacientes y staff
- **Análisis de mensajes**: Detección de urgencia
- **Automatizaciones**: Recordatorios y flujos

### WhatsApp Business
- **Baileys**: Conexión WebSocket estable
- **IA analysis**: Clasificación automática de mensajes
- **Respuestas automáticas**: Según políticas de la clínica

## 📊 Monitoreo y Logs

### Status Dashboard
- **Conexiones**: Supabase, SQL Server, WhatsApp, IA
- **Uptime**: Tiempo de actividad de servicios
- **Errores**: Logs automáticos de fallos
- **Performance**: Métricas de respuesta

## 🐛 Resolución de Problemas

### Problemas Comunes
1. **SQL Server no conecta**: Verificar host y credenciales
2. **Supabase errores**: Verificar URL y claves
3. **WhatsApp desconectado**: Reiniciar servicio Baileys
4. **IA no funciona**: Verificar Ollama host

### Logs
```bash
# Ver logs en desarrollo
npm run dev

# Logs de producción
pm2 logs rubio-garcia-dental
```

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: info@rubiogarciadental.com
- **Teléfono**: 916 410 841
- **Web**: www.rubiogarciadental.com

## 📄 Licencia

Desarrollado específicamente para Rubio García Dental.
Copyright © 2024

---

**🦷 Sistema Integral de Gestión Dental - Desarrollado con tecnología de vanguardia**