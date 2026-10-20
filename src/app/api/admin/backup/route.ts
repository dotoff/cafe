import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    const sourceDb = path.resolve(process.cwd(), 'payload.db')
    const backupDir = path.resolve(process.cwd(), 'backups')

    if (!fs.existsSync(sourceDb)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 })
    }

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const now = new Date()
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const backupFileName = `payload-backup-${dateStr}.db`
    const destDb = path.join(backupDir, backupFileName)

    fs.copyFileSync(sourceDb, destDb)
    const stats = fs.statSync(destDb)
    const sizeKb = Math.round(stats.size / 1024)

    return NextResponse.json({
      success: true,
      fileName: backupFileName,
      sizeKb,
      timestamp: now.toISOString(),
    })
  } catch (error: any) {
    console.error('Database backup error:', error)
    return NextResponse.json({ error: error?.message || 'Backup failed' }, { status: 500 })
  }
}
