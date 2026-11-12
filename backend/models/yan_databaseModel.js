// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_mysql = require('mysql2/promise');
const { yan_db_settings } = require('../config/yan_db');

async function yan_test_database_connection(yan_username, yan_password) {
  const yan_connection = await yan_mysql.createConnection({
    host: yan_db_settings.host,
    user: yan_username,
    password: yan_password,
    database: yan_db_settings.database,
    connectTimeout: 5000,
    charset: 'utf8mb4',
    dateStrings: true
  });

  try {
    const [yan_rows] = await yan_connection.query(`
      SELECT
        1 AS yan_ok,
        VERSION() AS yan_version,
        DATABASE() AS yan_database,
        CURRENT_TIMESTAMP AS yan_current_time
    `);

    return {
      host: yan_db_settings.host,
      database: yan_rows[0].yan_database,
      username: yan_username,
      serverVersion: yan_rows[0].yan_version,
      currentTime: yan_rows[0].yan_current_time
    };
  } finally {
    await yan_connection.end();
  }
}

module.exports = {
  yan_test_database_connection
};
