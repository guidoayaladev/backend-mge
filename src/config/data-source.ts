import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL ?? '';
const isExternal = !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  synchronize: false,
  ...(isExternal ? { ssl: { rejectUnauthorized: false } } : {}),
  entities: [
    join(__dirname, '..', '..', 'src', 'entities', '*.entity.{ts,js}'),
  ],
  migrations: [join(__dirname, '..', '..', 'src', 'migrations', '*.{ts,js}')],
});
