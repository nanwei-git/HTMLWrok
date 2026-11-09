// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_path = require('path');
const yan_dotenv = require('dotenv');
const yan_express = require('express');
const yan_cors = require('cors');
const yan_api_router = require('./routes/yan_api');
const {
  yan_not_found_handler,
  yan_error_handler
} = require('./middleware/yan_errorHandler');

yan_dotenv.config({ path: yan_path.join(__dirname, '.env'), quiet: true });

const yan_app = yan_express();

yan_app.disable('x-powered-by');
yan_app.use(yan_cors());
yan_app.use(yan_express.json({ limit: '1mb' }));
yan_app.use(yan_express.urlencoded({ extended: true, limit: '1mb' }));

yan_app.use('/api', yan_api_router);
yan_app.use(yan_express.static(yan_path.join(__dirname, '..', 'frontend')));

yan_app.use(yan_not_found_handler);
yan_app.use(yan_error_handler);

module.exports = yan_app;
