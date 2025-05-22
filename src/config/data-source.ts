import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  entities: [
    join(__dirname, '..', '..', 'src', 'entities', '*.entity.{ts,js}'),
  ],
  migrations: [join(__dirname, '..', '..', 'src', 'migrations', '*.{ts,js}')],
});
