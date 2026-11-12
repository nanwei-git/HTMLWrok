// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_express = require('express');
const yan_health_controller = require('../controllers/yan_healthController');
const yan_dashboard_controller = require('../controllers/yan_dashboardController');
const yan_workflow_controller = require('../controllers/yan_workflowController');
const yan_report_controller = require('../controllers/yan_reportController');
const yan_source_controller = require('../controllers/yan_sourceController');
const yan_database_controller = require('../controllers/yan_databaseController');
const yan_news_controller = require('../controllers/yan_newsController');
const yan_upload_controller = require('../controllers/yan_uploadController');
const yan_chat_controller = require('../controllers/yan_chatController');
const { yan_upload_single } = require('../middleware/yan_uploadMiddleware');

const yan_api_router = yan_express.Router();

yan_api_router.get('/health', yan_health_controller.yan_get_health);
yan_api_router.get('/dashboard', yan_dashboard_controller.yan_get_dashboard);

yan_api_router.get('/workflows', yan_workflow_controller.yan_get_workflows);
yan_api_router.post('/workflows/:id/runs', yan_workflow_controller.yan_run_workflow);
yan_api_router.get('/workflows/:id', yan_workflow_controller.yan_get_workflow_detail);

yan_api_router.get('/reports', yan_report_controller.yan_get_reports);
yan_api_router.get('/reports/:id', yan_report_controller.yan_get_report_detail);

yan_api_router.get('/data-sources', yan_source_controller.yan_get_sources);

yan_api_router.get('/database/test', yan_database_controller.yan_get_database_test_info);
yan_api_router.post('/database/test', yan_database_controller.yan_test_database);
yan_api_router.get('/tech-news', yan_news_controller.yan_get_tech_news);

yan_api_router.get('/uploads', yan_upload_controller.yan_get_uploads);
yan_api_router.post('/uploads', yan_upload_single, yan_upload_controller.yan_upload_file);
yan_api_router.delete('/uploads/:id', yan_upload_controller.yan_delete_upload_file);

yan_api_router.get('/chat', yan_chat_controller.yan_get_chat_info);
yan_api_router.post('/chat', yan_chat_controller.yan_chat);

module.exports = yan_api_router;
