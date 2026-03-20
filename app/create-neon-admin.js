const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = 'https://netsgjeuzsnlchhwbqif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldHNnamV1enNubGNoaHdicWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDg2MDEsImV4cCI6MjA4ODcyNDYwMX0.1gVopVuylZgzFUMboNnvPGlqAAnolyeokH4O0XcBIr4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const connectionString = process.env.DATABASE_URL;

async function main() {
  const email = 'admin@it-management.com';
  const password = 'AdminPassword123!@#';

  console.log('--- Phase 1: Supabase Auth ---');
  console.log(`Ensuring user exists in Supabase Auth: ${email}`);
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User already exists in Supabase Auth.');
    } else {
      console.error('Supabase Auth Error:', authError.message);
    }
  } else {
    console.log('User created/signed up in Supabase Auth.');
  }

  console.log('\n--- Phase 2: Neon Prisma DB ---');
  if (!connectionString) {
    console.error("DATABASE_URL is missing in .env");
    return;
  }

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Admin'
    },
    create: {
      email,
      username: email,
      password: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN'
    }
  });

  console.log('Admin user setup successful in Neon! User ID:', user.id);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  
  await pool.end();
}

main().catch(console.error);
