export default {
    telegramToken: process.env.TELEGRAM_TOKEN || '6516752254:AAENaVC3Udl_I-MAwdFV8qrKp0by7yojLQk',
    s3Bucket: process.env.S3_BUCKET || 'nfce-app',
    s3Region: process.env.S3_REGION || 'us-east-1',
    s3FiscalNotePath: process.env.S3_FISCAL_NOTE_PATH || 'nfce',
    dbHost: process.env.DB_HOST || 'localhost',
    dbDatabase: process.env.DB_DATABASE || 'fiscal_note',
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'postgres'
    
}
