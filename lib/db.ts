import sql from 'mssql'

const config: sql.config = {
  server: process.env.DB_SERVER ?? '',
  database: process.env.DB_NAME ?? '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool
  pool = await sql.connect(config)
  return pool
}
