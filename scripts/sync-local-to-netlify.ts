import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// Renk kodları
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(`${colors.yellow}${question}${colors.reset} `, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', colors.cyan)
  log('║     LOCAL VERITABANI → NETLIFY SENKRONIZASYONU          ║', colors.cyan)
  log('╚═══════════════════════════════════════════════════════════╝\n', colors.cyan)

  // .env dosyasından local DATABASE_URL oku
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    log('❌ .env dosyası bulunamadı!', colors.red)
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const localDbMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/)
  const netlifyDbMatch = envContent.match(/NETLIFY_DATABASE_URL="?([^"\n]+)"?/)

  if (!localDbMatch) {
    log('❌ .env dosyasında DATABASE_URL bulunamadı!', colors.red)
    process.exit(1)
  }

  if (!netlifyDbMatch) {
    log('❌ .env dosyasında NETLIFY_DATABASE_URL bulunamadı!', colors.red)
    log('\n💡 Lütfen .env dosyasına Netlify PostgreSQL connection string ekleyin:', colors.yellow)
    log('   NETLIFY_DATABASE_URL="postgresql://..."', colors.yellow)
    process.exit(1)
  }

  const localDbUrl = localDbMatch[1]
  const netlifyDbUrl = netlifyDbMatch[1]

  log('📊 Veritabanı Bilgileri:', colors.blue)
  log(`   Local:   ${localDbUrl.replace(/:[^:@]+@/, ':****@')}`, colors.bright)
  log(`   Netlify: ${netlifyDbUrl.replace(/:[^:@]+@/, ':****@')}`, colors.bright)

  // Uyarı
  log('\n⚠️  DİKKAT: Bu işlem:', colors.yellow)
  log('   1. Netlify veritabanındaki TÜM verileri silecek', colors.red)
  log("   2. Local veritabanınızı Netlify'e kopyalayacak", colors.green)
  log('   3. Bu işlem GERİ ALINAMAZ!\n', colors.red)

  const confirm1 = await prompt('Devam etmek istediğinize emin misiniz? (evet/hayır): ')
  if (confirm1.toLowerCase() !== 'evet') {
    log('\n❌ İşlem iptal edildi.', colors.yellow)
    process.exit(0)
  }

  const confirm2 = await prompt(
    'Netlify veritabanındaki verilerin SİLİNECEĞİNİ anlıyorum (EVET/hayır): '
  )
  if (confirm2 !== 'EVET') {
    log('\n❌ İşlem iptal edildi.', colors.yellow)
    process.exit(0)
  }

  try {
    const dumpFile = path.join(process.cwd(), 'backup.sql')

    // 1. Local veritabanından dump al
    log('\n📦 1/4 - Local veritabanından dump alınıyor...', colors.cyan)
    try {
      execSync(`pg_dump "${localDbUrl}" --no-owner --no-acl -f "${dumpFile}"`, {
        stdio: 'inherit',
      })
      log('   ✅ Dump başarıyla alındı', colors.green)
    } catch (error) {
      log('   ❌ Dump alma hatası!', colors.red)
      log(
        "   💡 pg_dump yüklü değilse PostgreSQL kurulu olmalı veya PATH'e eklenmelidir",
        colors.yellow
      )
      throw error
    }

    // 2. Netlify veritabanını temizle
    log('\n🗑️  2/4 - Netlify veritabanı temizleniyor...', colors.cyan)
    try {
      // Önce tüm tabloları listele ve sil
      const dropTablesCmd = `
        psql "${netlifyDbUrl}" -c "
          DO $$ DECLARE
            r RECORD;
          BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
          END $$;
        "
      `
      execSync(dropTablesCmd, { stdio: 'inherit' })
      log('   ✅ Veritabanı temizlendi', colors.green)
    } catch (error) {
      log('   ❌ Temizleme hatası!', colors.red)
      throw error
    }

    // 3. Dump'ı Netlify'e restore et
    log("\n📥 3/4 - Dump Netlify'e yükleniyor...", colors.cyan)
    try {
      execSync(`psql "${netlifyDbUrl}" -f "${dumpFile}"`, { stdio: 'inherit' })
      log('   ✅ Veritabanı başarıyla yüklendi', colors.green)
    } catch (error) {
      log('   ❌ Restore hatası!', colors.red)
      throw error
    }

    // 4. Backup dosyasını sil
    log('\n🧹 4/4 - Temizlik yapılıyor...', colors.cyan)
    if (fs.existsSync(dumpFile)) {
      fs.unlinkSync(dumpFile)
      log('   ✅ Geçici dosyalar temizlendi', colors.green)
    }

    log('\n╔═══════════════════════════════════════════════════════════╗', colors.green)
    log('║              SENKRONIZASYON BAŞARILI! 🎉                 ║', colors.green)
    log('╚═══════════════════════════════════════════════════════════╝\n', colors.green)

    log("✅ Local veritabanınız başarıyla Netlify'e kopyalandı!", colors.bright)
    log("\n💡 Artık Netlify'de local veritabanınızın tam kopyası mevcut.", colors.blue)
  } catch (error) {
    log('\n❌ HATA: Senkronizasyon başarısız!', colors.red)
    console.error(error)
    process.exit(1)
  }
}

main().catch(error => {
  log('\n❌ Beklenmeyen hata:', colors.red)
  console.error(error)
  process.exit(1)
})
