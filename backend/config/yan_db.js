// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_path = require('path');
const yan_dotenv = require('dotenv');
const yan_mysql = require('mysql2/promise');

yan_dotenv.config({ path: yan_path.join(__dirname, '..', '.env'), quiet: true });

const yan_pool = yan_mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true
});

const yan_db_settings = Object.freeze({
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'yan_report_platform'
});

async function yan_check_database_connection() {
  const yan_connection = await yan_pool.getConnection();

  try {
    await yan_connection.ping();
    return true;
  } finally {
    yan_connection.release();
  }
}

module.exports = {
  yan_pool,
  yan_db_settings,
  yan_check_database_connection
};
