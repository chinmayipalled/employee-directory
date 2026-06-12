import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sql from 'mssql'

export const SQL_POOL = 'SQL_POOL'

@Global()
@Module({
  providers: [
    {
      provide: SQL_POOL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<sql.ConnectionPool> => {
        const pool = new sql.ConnectionPool({
          server: config.get<string>('DB_SERVER') ?? '',
          database: config.get<string>('DB_NAME') ?? '',
          port: parseInt(config.get<string>('DB_PORT') ?? '1433', 10),
          user: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          options: {
            trustServerCertificate: true,
            encrypt: false,
          },
        })
        await pool.connect()
        return pool
      },
    },
  ],
  exports: [SQL_POOL],
})
export class DatabaseModule {}
