import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    '.env.local',
    '.env'
  ]
});

const isProduction = process.env.NODE_ENV === 'production';

function productionEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (isProduction && !value) {
    throw new Error(`${name} wajib diatur saat NODE_ENV=production.`);
  }
  return value;
}

const jwtAccessSecret = productionEnv('JWT_ACCESS_SECRET') ?? 'dev_access_secret';
const jwtRefreshSecret = productionEnv('JWT_REFRESH_SECRET') ?? 'dev_refresh_secret';

if (isProduction && (jwtAccessSecret.length < 32 || jwtRefreshSecret.length < 32)) {
  throw new Error('JWT_ACCESS_SECRET dan JWT_REFRESH_SECRET harus memiliki minimal 32 karakter.');
}

if (isProduction && jwtAccessSecret === jwtRefreshSecret) {
  throw new Error('JWT_ACCESS_SECRET dan JWT_REFRESH_SECRET harus berbeda.');
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: productionEnv('FRONTEND_URL') ?? 'http://localhost:3000',
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  databaseUrl: productionEnv('DATABASE_URL') ?? 'postgresql://postgres:postgres@localhost:5432/lms_db?schema=public',
  appEnv: process.env.APP_ENV ?? 'development',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  smtp: {
    host: process.env.SMTP_HOST ?? 'smtp.example.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? 'example',
    pass: process.env.SMTP_PASS ?? 'example',
    from: process.env.SMTP_FROM ?? 'LMS <noreply@example.com>'
  }
};
