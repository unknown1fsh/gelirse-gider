#!/usr/bin/env node

const { execSync } = require('child_process');

// Migration'ı çalıştır, başarısız olursa durdur
console.log('🔄 Running database migrations...');
try {
  execSync('prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed!');
  console.error('📋 Error details:', error.message);
  console.error('\n💡 Possible reasons:');
  console.error('   - Database connection issue');
  console.error('   - Missing migration files');
  console.error('   - Schema conflicts');
  console.error('   - Database permissions issue');
  console.error('\n🔧 Please fix the migration error before continuing.');
  process.exit(1);
}

// Seed'i sadece migration başarılı olduğunda çalıştır
console.log('\n🌱 Running database seed...');
try {
  execSync('tsx prisma/seed.ts', { stdio: 'inherit' });
  console.log('✅ Seed completed successfully!');
} catch (error) {
  console.error('\n❌ Seed failed!');
  console.error('📋 Error details:', error.message);
  console.error('\n🔧 Please check the seed script and database connection.');
  process.exit(1);
}

