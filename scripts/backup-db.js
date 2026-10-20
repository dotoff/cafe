/**
 * SQLite Database Backup Script for Flavourite Cafe & Bakery
 * Usage: node scripts/backup-db.js
 * Automatically creates timestamped copies of payload.db into the /backups folder.
 */

const fs = require('fs')
const path = require('path')

const sourceDb = path.resolve(__dirname, '../payload.db')
const backupDir = path.resolve(__dirname, '../backups')

if (!fs.existsSync(sourceDb)) {
  console.error(`[Backup Error] Database file not found at: ${sourceDb}`)
  process.exit(1)
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

const now = new Date()
const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
const destDb = path.join(backupDir, `payload-backup-${dateStr}.db`)

try {
  fs.copyFileSync(sourceDb, destDb)
  const stats = fs.statSync(destDb)
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2)
  console.log(`[Backup Success] Created snapshot: ${destDb} (${sizeMb} MB)`)

  // Retention: Keep only the 10 most recent backups to save disk space
  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('payload-backup-') && f.endsWith('.db'))
    .map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time)

  if (files.length > 10) {
    const toDelete = files.slice(10)
    toDelete.forEach(f => {
      fs.unlinkSync(path.join(backupDir, f.name))
      console.log(`[Backup Prune] Removed older backup: ${f.name}`)
    })
  }
} catch (err) {
  console.error('[Backup Failed]:', err)
  process.exit(1)
}
