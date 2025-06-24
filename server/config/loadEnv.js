import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});