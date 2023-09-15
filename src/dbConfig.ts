import dotenv from 'dotenv';

// Load environment variables from the path
dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}
