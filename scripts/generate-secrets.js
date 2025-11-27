#!/usr/bin/env node
const crypto = require('crypto');

console.log('\n🔐 GENERADOR DE SECRETOS\n');
const jwt = crypto.randomBytes(32).toString('hex');
const auth = crypto.randomBytes(32).toString('base64');

console.log('JWT_SECRET="' + jwt + '"');
console.log('NEXTAUTH_SECRET="' + auth + '"');
console.log('\n✅ Copia estos valores a .env.local\n');
