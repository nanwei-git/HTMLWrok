// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_express = require('express');
const yan_health_controller = require('../controllers/yan_healthController');

const yan_api_router = yan_express.Router();

yan_api_router.get('/health', yan_health_controller.yan_get_health);

module.exports = yan_api_router;
