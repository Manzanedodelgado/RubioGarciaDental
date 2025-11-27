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
