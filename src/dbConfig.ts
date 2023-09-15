import dotenv from 'dotenv';

// Load environment variables from the path
dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'sw_test',
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}
