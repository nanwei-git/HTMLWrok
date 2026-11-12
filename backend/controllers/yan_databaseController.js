// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_test_database_connection } = require('../models/yan_databaseModel');
const { yan_db_settings } = require('../config/yan_db');

function yan_map_database_error(yan_error) {
  switch (yan_error.code) {
    case 'ER_ACCESS_DENIED_ERROR':
      return {
        status: 401,
        msg: '用户名或密码不正确，无法连接 MySQL'
      };
    case 'ER_DBACCESS_DENIED_ERROR':
      return {
        status: 403,
        msg: '当前账号没有访问目标数据库的权限'
      };
    case 'ER_BAD_DB_ERROR':
      return {
        status: 404,
        msg: `目标数据库 ${yan_db_settings.database} 不存在`
      };
    case 'ECONNREFUSED':
      return {
        status: 503,
        msg: '无法连接 MySQL 服务，请确认数据库已启动'
      };
    case 'ETIMEDOUT':
    case 'PROTOCOL_SEQUENCE_TIMEOUT':
      return {
        status: 504,
        msg: '连接 MySQL 超时，请检查网络与数据库地址'
      };
    case 'PROTOCOL_CONNECTION_LOST':
      return {
        status: 503,
        msg: 'MySQL 连接已断开，请稍后重试'
      };
    default:
      return {
        status: 500,
        msg: '数据库连接失败，请检查数据库配置'
      };
  }
}

async function yan_test_database(yan_req, yan_res, yan_next) {  const yan_username = yan_req.body && typeof yan_req.body.username === 'string'
    ? yan_req.body.username.trim()
    : '';
  const yan_password = yan_req.body && typeof yan_req.body.password === 'string'
    ? yan_req.body.password
    : null;

  if (!yan_username || yan_username.length > 64) {
    yan_res.status(400).json({
      code: 400,
      msg: '请输入有效的 MySQL 用户名',
      data: {}
    });
    return;
  }

  if (yan_password === null || yan_password.length > 128) {
    yan_res.status(400).json({
      code: 400,
      msg: '请输入有效的 MySQL 密码',
      data: {}
    });
    return;
  }

  try {
    const yan_connection_info = await yan_test_database_connection(yan_username, yan_password);

    yan_res.json({
      code: 0,
      msg: '数据库连接成功',
      data: yan_connection_info
    });
  } catch (yan_error) {
    const yan_failure = yan_map_database_error(yan_error);

    console.error('[数据库连接测试] 连接失败：', {
      username: yan_username,
      host: yan_db_settings.host,
      database: yan_db_settings.database,
      code: yan_error.code || 'UNKNOWN_ERROR',
      message: yan_error.message
    });

    yan_res.status(yan_failure.status).json({
      code: yan_failure.status,
      msg: yan_failure.msg,
      data: {
        reason: yan_error.code || 'UNKNOWN_ERROR'
      }
    });
  }
}

function yan_get_database_test_info(yan_req, yan_res) {
  yan_res.json({
    code: 0,
    msg: '数据库连接测试接口说明',
    data: {
      method: 'POST',
      path: '/api/database/test',
      contentType: 'application/json',
      fields: {
        username: 'MySQL 用户名，例如 root',
        password: 'MySQL 密码，仅用于本次连接测试'
      },
      note: '该接口使用 backend/.env 中的 DB_HOST 与 DB_NAME，用户名和密码由请求体传入。'
    }
  });
}

module.exports = {
  yan_get_database_test_info,
  yan_test_database
};
