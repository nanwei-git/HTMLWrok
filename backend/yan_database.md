<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free
-->

# 数据库变更记录

> 本文件仅追加，不覆盖历史记录。所有建表、改表与测试数据 SQL 均按执行顺序记录于此。

## 2026-11-09 15:45:00 | 项目初始化

- 当前阶段完成数据库连接配置（`backend/config/yan_db.js`）与环境变量约定。
- 尚未创建业务数据表；待首个数据表建立后，在此追加完整建表及测试数据 SQL。

## 2026-11-09 16:09:53 | 数据分析报表工作流平台初始化

- 数据库名：`yan_report_platform`。
- 本次创建 5 张业务表：数据源、工作流、工作流步骤、报表、工作流运行记录。
- 所有表名与字段均使用 `yan_` 前缀。
- 以下 SQL 按执行顺序排列，可在新机器上完整重建数据库与测试数据。
- 注意：脚本会先删除本项目的 5 张业务表后重建，请勿在已有生产数据的库中直接执行。

```sql
CREATE DATABASE IF NOT EXISTS `yan_report_platform`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `yan_report_platform`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `yan_workflow_runs`;
DROP TABLE IF EXISTS `yan_reports`;
DROP TABLE IF EXISTS `yan_workflow_steps`;
DROP TABLE IF EXISTS `yan_workflows`;
DROP TABLE IF EXISTS `yan_data_sources`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `yan_data_sources` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_name` VARCHAR(100) NOT NULL COMMENT '数据源名称',
  `yan_type` ENUM('MySQL', 'CSV', 'API', 'PostgreSQL') NOT NULL COMMENT '数据源类型',
  `yan_host` VARCHAR(160) NOT NULL COMMENT '连接地址或文件路径',
  `yan_description` VARCHAR(255) NOT NULL COMMENT '数据内容说明',
  `yan_status` ENUM('connected', 'syncing', 'error') NOT NULL DEFAULT 'connected' COMMENT '连接状态',
  `yan_record_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '当前记录数',
  `yan_last_synced_at` DATETIME NULL COMMENT '最近同步时间',
  `yan_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`yan_id`),
  KEY `yan_idx_data_sources_status` (`yan_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据源';

CREATE TABLE `yan_workflows` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_name` VARCHAR(100) NOT NULL COMMENT '工作流名称',
  `yan_description` VARCHAR(255) NOT NULL COMMENT '工作流说明',
  `yan_owner` VARCHAR(40) NOT NULL COMMENT '负责人',
  `yan_status` ENUM('active', 'paused', 'draft') NOT NULL DEFAULT 'draft' COMMENT '运行状态',
  `yan_schedule` VARCHAR(60) NOT NULL COMMENT '调度计划',
  `yan_last_run_at` DATETIME NULL COMMENT '最近运行时间',
  `yan_success_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT '成功率',
  `yan_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `yan_updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`yan_id`),
  KEY `yan_idx_workflows_status` (`yan_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据分析工作流';

CREATE TABLE `yan_workflow_steps` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_workflow_id` INT UNSIGNED NOT NULL COMMENT '所属工作流',
  `yan_step_order` TINYINT UNSIGNED NOT NULL COMMENT '步骤顺序',
  `yan_name` VARCHAR(100) NOT NULL COMMENT '步骤名称',
  `yan_step_type` ENUM('extract', 'clean', 'transform', 'analyze', 'visualize', 'deliver') NOT NULL COMMENT '步骤类型',
  `yan_config_summary` VARCHAR(255) NOT NULL COMMENT '配置摘要',
  `yan_status` ENUM('ready', 'warning', 'disabled') NOT NULL DEFAULT 'ready' COMMENT '步骤状态',
  `yan_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`yan_id`),
  UNIQUE KEY `yan_uk_workflow_step` (`yan_workflow_id`, `yan_step_order`),
  CONSTRAINT `yan_fk_steps_workflow` FOREIGN KEY (`yan_workflow_id`) REFERENCES `yan_workflows` (`yan_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作流步骤';

CREATE TABLE `yan_reports` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_workflow_id` INT UNSIGNED NULL COMMENT '生成报表的工作流',
  `yan_title` VARCHAR(120) NOT NULL COMMENT '报表标题',
  `yan_category` VARCHAR(30) NOT NULL COMMENT '报表分类',
  `yan_summary` VARCHAR(500) NOT NULL COMMENT '摘要',
  `yan_status` ENUM('published', 'review', 'draft') NOT NULL DEFAULT 'draft' COMMENT '发布状态',
  `yan_owner` VARCHAR(40) NOT NULL COMMENT '创建人',
  `yan_views` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `yan_chart_labels` JSON NOT NULL COMMENT '趋势图标签',
  `yan_chart_values` JSON NOT NULL COMMENT '趋势图数值',
  `yan_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `yan_updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`yan_id`),
  KEY `yan_idx_reports_category` (`yan_category`),
  KEY `yan_idx_reports_status` (`yan_status`),
  CONSTRAINT `yan_fk_reports_workflow` FOREIGN KEY (`yan_workflow_id`) REFERENCES `yan_workflows` (`yan_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分析报表';

CREATE TABLE `yan_workflow_runs` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_workflow_id` INT UNSIGNED NOT NULL COMMENT '所属工作流',
  `yan_status` ENUM('success', 'failed', 'running') NOT NULL DEFAULT 'running' COMMENT '运行结果',
  `yan_duration_seconds` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '耗时秒数',
  `yan_rows_processed` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '处理行数',
  `yan_trigger_type` ENUM('schedule', 'manual') NOT NULL DEFAULT 'schedule' COMMENT '触发方式',
  `yan_started_at` DATETIME NOT NULL COMMENT '开始时间',
  `yan_finished_at` DATETIME NULL COMMENT '结束时间',
  PRIMARY KEY (`yan_id`),
  KEY `yan_idx_runs_workflow` (`yan_workflow_id`),
  KEY `yan_idx_runs_started` (`yan_started_at`),
  CONSTRAINT `yan_fk_runs_workflow` FOREIGN KEY (`yan_workflow_id`) REFERENCES `yan_workflows` (`yan_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作流运行记录';

INSERT INTO `yan_data_sources`
  (`yan_id`, `yan_name`, `yan_type`, `yan_host`, `yan_description`, `yan_status`, `yan_record_count`, `yan_last_synced_at`, `yan_created_at`)
VALUES
  (1, '交易主库', 'MySQL', '10.20.1.12:3306', '订单、支付与退款明细', 'connected', 1284600, '2026-11-09 08:25:00', '2026-10-08 09:10:00'),
  (2, '用户行为埋点', 'API', 'api-insight.yunqi.local/v2', '页面访问、点击与转化事件', 'syncing', 896320, '2026-11-09 07:50:00', '2026-10-09 10:20:00'),
  (3, 'CRM 客户档案', 'MySQL', 'crm-prod:3306', '会员画像与生命周期标签', 'connected', 248760, '2026-11-09 08:10:00', '2026-10-10 11:00:00'),
  (4, '商品中心', 'PostgreSQL', 'goods-db:5432', 'SKU、类目与库存快照', 'connected', 76540, '2026-11-09 07:30:00', '2026-10-11 14:35:00'),
  (5, '市场投放日报', 'CSV', '/data/imports/marketing_daily.csv', '渠道花费、曝光与点击数据', 'error', 18420, '2026-11-08 18:00:00', '2026-10-12 09:45:00'),
  (6, '财务结算流水', 'MySQL', 'finance-db:3306', '应收应付与结算记录', 'connected', 34218, '2026-11-09 06:40:00', '2026-10-13 16:10:00'),
  (7, '客服工单系统', 'API', 'service-desk.yunqi.local/open-api', '工单分类与满意度评价', 'connected', 9128, '2026-11-09 08:05:00', '2026-10-14 09:30:00'),
  (8, '门店经营数据', 'CSV', '/data/imports/store_weekly.csv', '华东门店周度经营数据', 'connected', 1260, '2026-11-08 21:15:00', '2026-10-15 13:20:00');

INSERT INTO `yan_workflows`
  (`yan_id`, `yan_name`, `yan_description`, `yan_owner`, `yan_status`, `yan_schedule`, `yan_last_run_at`, `yan_success_rate`, `yan_created_at`, `yan_updated_at`)
VALUES
  (1, '每日经营日报', '汇聚交易与用户数据，生成面向管理层的经营日报', '杨庆鸿', 'active', '每天 08:30', '2026-11-09 14:22:35', 98.60, '2026-10-08 09:30:00', '2026-11-09 14:22:35'),
  (2, '用户增长周报', '追踪新增、活跃与留存，输出用户增长分析周报', '林晓', 'active', '每周一 09:00', '2026-11-09 09:01:43', 96.40, '2026-10-09 10:00:00', '2026-11-09 09:01:43'),
  (3, '销售漏斗分析', '分析线索到成交的转化路径，识别流失环节', '周宁', 'active', '每天 10:00', '2026-11-09 10:01:25', 94.80, '2026-10-10 11:15:00', '2026-11-09 10:01:25'),
  (4, '渠道投放复盘', '核算各渠道投放成本与回报，形成复盘结论', '陈屿', 'paused', '每周五 17:00', '2026-11-06 17:05:23', 89.20, '2026-10-11 15:00:00', '2026-11-06 17:05:23'),
  (5, '库存风险预警', '巡检商品库存，识别低周转与超储风险', '杨庆鸿', 'active', '每小时', '2026-11-09 11:00:47', 99.10, '2026-10-12 09:50:00', '2026-11-09 11:00:47'),
  (6, '财务月结报表', '完成流水汇总、对账校验与月结报表生成', '苏晚', 'active', '每月 1 日 07:00', '2026-11-01 07:03:51', 97.50, '2026-10-13 16:30:00', '2026-11-01 07:03:51'),
  (7, '客服满意度分析', '聚合工单与评价数据，定位满意度波动原因', '林晓', 'draft', '手动触发', NULL, 0.00, '2026-11-02 10:10:00', '2026-11-02 10:10:00'),
  (8, '门店经营看板', '对比华东门店经营表现，生成周度看板', '周宁', 'paused', '每天 18:00', '2026-11-07 18:00:56', 91.70, '2026-10-15 13:40:00', '2026-11-07 18:00:56');

INSERT INTO `yan_workflow_steps`
  (`yan_id`, `yan_workflow_id`, `yan_step_order`, `yan_name`, `yan_step_type`, `yan_config_summary`, `yan_status`, `yan_created_at`)
VALUES
  (1, 1, 1, '抽取交易明细', 'extract', '增量读取订单、支付、退款三表', 'ready', '2026-10-08 09:35:00'),
  (2, 1, 2, '清洗异常订单', 'clean', '剔除测试单、重复单与负金额记录', 'ready', '2026-10-08 09:36:00'),
  (3, 1, 3, '聚合经营指标', 'transform', '按渠道与区域汇总 GMV、订单量', 'ready', '2026-10-08 09:37:00'),
  (4, 1, 4, '生成并推送日报', 'deliver', '输出 PDF 日报并推送企业微信', 'ready', '2026-10-08 09:38:00'),
  (5, 2, 1, '汇聚行为事件', 'extract', '通过 API 拉取近 7 日行为事件', 'ready', '2026-10-09 10:05:00'),
  (6, 2, 2, '构建用户分层', 'transform', '按 RFM 模型完成用户分层', 'ready', '2026-10-09 10:06:00'),
  (7, 2, 3, '生成增长图表', 'visualize', '生成增长趋势与分层图表', 'ready', '2026-10-09 10:07:00'),
  (8, 2, 4, '投递订阅邮件', 'deliver', '投递订阅邮件至运营组', 'ready', '2026-10-09 10:08:00'),
  (9, 3, 1, '读取销售链路数据', 'extract', '读取线索、商机与订单数据', 'ready', '2026-10-10 11:20:00'),
  (10, 3, 2, '统一渠道口径', 'clean', '统一渠道与销售阶段口径', 'ready', '2026-10-10 11:21:00'),
  (11, 3, 3, '计算漏斗转化率', 'analyze', '计算各阶段漏斗转化率', 'ready', '2026-10-10 11:22:00'),
  (12, 3, 4, '输出诊断看板', 'visualize', '输出销售漏斗诊断看板', 'ready', '2026-10-10 11:23:00'),
  (13, 4, 1, '拉取投放账单', 'extract', '拉取各渠道投放账单', 'warning', '2026-10-11 15:05:00'),
  (14, 4, 2, '归因与成本核算', 'transform', '完成曝光归因与成本核算', 'ready', '2026-10-11 15:06:00'),
  (15, 4, 3, '生成复盘简报', 'deliver', '生成渠道复盘简报', 'ready', '2026-10-11 15:07:00'),
  (16, 5, 1, '扫描库存快照', 'extract', '扫描商品库存快照', 'ready', '2026-10-12 09:55:00'),
  (17, 5, 2, '识别低周转 SKU', 'analyze', '识别低周转与超储 SKU', 'ready', '2026-10-12 09:56:00'),
  (18, 5, 3, '推送风险预警', 'deliver', '推送库存风险预警', 'ready', '2026-10-12 09:57:00'),
  (19, 6, 1, '汇总财务流水', 'extract', '汇总应收、应付与结算流水', 'ready', '2026-10-13 16:35:00'),
  (20, 6, 2, '对账与差异校验', 'clean', '执行对账与差异校验', 'warning', '2026-10-13 16:36:00'),
  (21, 6, 3, '生成月结报表', 'deliver', '生成财务月结报表', 'ready', '2026-10-13 16:37:00'),
  (22, 7, 1, '同步工单数据', 'extract', '同步客服工单与评价数据', 'ready', '2026-11-02 10:15:00'),
  (23, 7, 2, '满意度归因分析', 'analyze', '完成满意度归因分析', 'ready', '2026-11-02 10:16:00'),
  (24, 8, 1, '汇总门店周数据', 'extract', '汇总华东门店周度经营数据', 'ready', '2026-10-15 13:45:00'),
  (25, 8, 2, '门店对比分析', 'analyze', '完成门店横向对比分析', 'ready', '2026-10-15 13:46:00'),
  (26, 8, 3, '生成经营看板', 'visualize', '生成门店经营看板', 'ready', '2026-10-15 13:47:00');

INSERT INTO `yan_reports`
  (`yan_id`, `yan_workflow_id`, `yan_title`, `yan_category`, `yan_summary`, `yan_status`, `yan_owner`, `yan_views`, `yan_chart_labels`, `yan_chart_values`, `yan_created_at`, `yan_updated_at`)
VALUES
  (1, 1, '2026年11月经营日报', '经营分析', '全渠道 GMV 连续三日回升，华东区域贡献最高，退款率保持在健康区间。', 'published', '杨庆鸿', 128, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(82.4, 86.1, 79.8, 91.2, 94.7, 88.5, 96.3), '2026-11-09 08:35:00', '2026-11-09 08:35:00'),
  (2, 2, '双十一预热用户增长周报', '用户增长', '新增用户环比提升 18.6%，内容渠道带来的高意向用户占比继续扩大。', 'published', '林晓', 96, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(12.8, 14.2, 13.5, 16.9, 18.4, 17.6, 21.3), '2026-11-09 09:05:00', '2026-11-09 09:05:00'),
  (3, 3, '销售漏斗转化诊断', '销售分析', '商机到订单阶段流失率偏高，建议优先优化报价后的跟进节奏。', 'published', '周宁', 84, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(28.4, 29.1, 27.6, 31.8, 30.2, 32.5, 33.1), '2026-11-09 10:03:00', '2026-11-09 10:03:00'),
  (4, 4, '渠道投放 ROI 复盘', '运营监控', '信息流渠道获客成本上升，短视频渠道 ROI 领先，建议调整下周预算结构。', 'review', '陈屿', 52, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(3.2, 3.8, 3.1, 4.2, 3.9, 4.5, 4.1), '2026-11-05 17:12:00', '2026-11-08 09:30:00'),
  (5, 5, '库存周转风险预警', '风险预警', '低周转 SKU 数量连续下降，但仍有 10 个 SKU 触发超储预警。', 'published', '杨庆鸿', 73, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(18, 21, 17, 14, 16, 12, 10), '2026-11-06 11:05:00', '2026-11-09 11:02:00'),
  (6, 6, '10月财务结算月报', '财务分析', '10 月营收同比增长 12.4%，结算差异已全部闭环，现金流保持稳定。', 'published', '苏晚', 112, JSON_ARRAY('10-01', '10-06', '10-11', '10-16', '10-21', '10-26', '10-31'), JSON_ARRAY(860, 875, 890, 884, 902, 918, 936), '2026-11-01 07:15:00', '2026-11-01 07:15:00'),
  (7, 7, '客服满意度趋势观察', '运营监控', '售后咨询满意度波动明显，等待时长与解决率是主要影响因素。', 'draft', '林晓', 18, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(86.2, 87.1, 85.6, 88.4, 89.2, 87.9, 90.1), '2026-11-07 15:20:00', '2026-11-07 15:20:00'),
  (8, 8, '华东门店经营周报', '经营分析', '华东门店整体经营指数提升，上海与杭州门店表现领先，苏州门店需关注客流。', 'published', '周宁', 67, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(92, 88, 95, 90, 97, 93, 98), '2026-11-04 18:05:00', '2026-11-04 18:05:00'),
  (9, 2, '会员复购分层洞察', '用户增长', '高价值会员复购率持续提升，沉睡会员召回活动仍有较大优化空间。', 'published', '陈屿', 45, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(34, 36, 33, 38, 41, 39, 43), '2026-11-03 09:20:00', '2026-11-03 09:20:00'),
  (10, 5, '促销活动异常监控', '风险预警', '大促期间异常订单小幅上升，主要集中在优惠券叠加与重复提交场景。', 'review', '杨庆鸿', 31, JSON_ARRAY('11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'), JSON_ARRAY(6, 8, 5, 9, 7, 11, 8), '2026-11-08 14:30:00', '2026-11-09 09:40:00');

INSERT INTO `yan_workflow_runs`
  (`yan_id`, `yan_workflow_id`, `yan_status`, `yan_duration_seconds`, `yan_rows_processed`, `yan_trigger_type`, `yan_started_at`, `yan_finished_at`)
VALUES
  (1, 1, 'success', 142, 18640, 'schedule', '2026-11-09 08:30:12', '2026-11-09 08:32:34'),
  (2, 2, 'success', 98, 12480, 'schedule', '2026-11-09 09:00:05', '2026-11-09 09:01:43'),
  (3, 3, 'success', 76, 9320, 'schedule', '2026-11-09 10:00:09', '2026-11-09 10:01:25'),
  (4, 5, 'success', 44, 3180, 'schedule', '2026-11-09 11:00:03', '2026-11-09 11:00:47'),
  (5, 5, 'success', 41, 2940, 'schedule', '2026-11-09 10:00:03', '2026-11-09 10:00:44'),
  (6, 1, 'success', 138, 17520, 'schedule', '2026-11-08 08:30:11', '2026-11-08 08:32:29'),
  (7, 4, 'failed', 63, 0, 'manual', '2026-11-06 17:04:20', '2026-11-06 17:05:23'),
  (8, 3, 'success', 81, 8870, 'schedule', '2026-11-08 10:00:07', '2026-11-08 10:01:28'),
  (9, 8, 'success', 52, 1260, 'schedule', '2026-11-07 18:00:04', '2026-11-07 18:00:56'),
  (10, 6, 'success', 226, 34218, 'schedule', '2026-11-01 07:00:05', '2026-11-01 07:03:51'),
  (11, 2, 'success', 105, 13960, 'schedule', '2026-11-02 09:00:06', '2026-11-02 09:01:51'),
  (12, 1, 'success', 145, 18920, 'manual', '2026-11-09 14:20:10', '2026-11-09 14:22:35');
```

## 2026-11-09 16:45:00 | 科技新闻表

- 新增 `yan_tech_news` 表，用于科技新闻列表页面。
- 本次插入 12 条测试数据，覆盖人工智能、云计算、开源生态、芯片硬件、网络安全与前沿研究。
- 脚本会先删除 `yan_tech_news` 后重建，不影响其他业务表。

```sql
DROP TABLE IF EXISTS `yan_tech_news`;

CREATE TABLE `yan_tech_news` (
  `yan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `yan_title` VARCHAR(160) NOT NULL COMMENT '新闻标题',
  `yan_summary` VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  `yan_source` VARCHAR(80) NOT NULL COMMENT '来源媒体',
  `yan_category` ENUM('人工智能', '云计算', '开源生态', '芯片硬件', '网络安全', '前沿研究') NOT NULL COMMENT '新闻分类',
  `yan_author` VARCHAR(40) NOT NULL COMMENT '作者或编辑',
  `yan_published_at` DATETIME NOT NULL COMMENT '发布时间',
  `yan_read_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '阅读次数',
  `yan_url` VARCHAR(255) NOT NULL COMMENT '原文链接',
  `yan_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`yan_id`),
  KEY `yan_idx_tech_news_category` (`yan_category`),
  KEY `yan_idx_tech_news_published` (`yan_published_at`),
  KEY `yan_idx_tech_news_source` (`yan_source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科技新闻';

INSERT INTO `yan_tech_news`
  (`yan_id`, `yan_title`, `yan_summary`, `yan_source`, `yan_category`, `yan_author`, `yan_published_at`, `yan_read_count`, `yan_url`, `yan_created_at`)
VALUES
  (1, '开源推理框架发布 2.0，支持多模态批处理', '新版本重构了调度内核，在多模态输入与长上下文场景下提升了吞吐，并补充了细粒度显存监控。', 'InfoQ', '人工智能', '林澈', '2026-11-09 09:20:00', 3820, 'https://www.infoq.cn', '2026-11-09 09:20:00'),
  (2, '云原生数据库新增向量检索能力', '向量索引与关系查询在同一执行引擎中完成，面向推荐、检索增强生成等场景提供统一访问方式。', 'InfoQ', '云计算', '周宁', '2026-11-08 16:45:00', 2941, 'https://www.infoq.cn', '2026-11-08 16:45:00'),
  (3, '国产 RISC-V 服务器芯片完成量产验证', '该芯片面向边缘计算与轻量云场景，已完成操作系统、编译器与主流数据库的适配验证。', '量子位', '芯片硬件', '陈屿', '2026-11-08 11:10:00', 4186, 'https://www.qbitai.com', '2026-11-08 11:10:00'),
  (4, '开源社区推出轻量级数据编排规范', '规范聚焦任务依赖、重试策略与可观测字段，旨在降低不同数据编排工具之间的迁移成本。', '开源中国', '开源生态', '苏晚', '2026-11-07 14:30:00', 1760, 'https://www.oschina.net', '2026-11-07 14:30:00'),
  (5, '研究团队提出低功耗存算一体新架构', '团队展示了面向矩阵计算的存算一体单元，在特定负载下显著降低数据搬运开销。', '量子位', '前沿研究', '林晓', '2026-11-06 10:05:00', 2380, 'https://www.qbitai.com', '2026-11-06 10:05:00'),
  (6, '浏览器端 AI 推理接口进入标准化讨论', '新提案希望统一模型加载、能力探测与隐私边界，让本地推理能力在 Web 应用间更易复用。', 'InfoQ', '人工智能', '杨庆鸿', '2026-11-05 18:20:00', 3120, 'https://www.infoq.cn', '2026-11-05 18:20:00'),
  (7, '云厂商上线跨区域容灾自动化编排服务', '服务支持按业务等级配置切换策略，并提供演练报告与切换耗时追踪。', '36氪', '云计算', '周宁', '2026-11-05 09:15:00', 1480, 'https://www.36kr.com', '2026-11-05 09:15:00'),
  (8, '供应链安全扫描工具发现新型依赖投毒手法', '攻击者通过篡改构建脚本与镜像标签绕过常规检测，工具厂商已更新规则库。', '开源中国', '网络安全', '陈屿', '2026-11-04 17:40:00', 5012, 'https://www.oschina.net', '2026-11-04 17:40:00'),
  (9, '新一代固态存储控制器降低数据中心能耗', '控制器引入动态功耗调度与更细粒度的健康预测，面向高密度存储节点优化。', '36氪', '芯片硬件', '苏晚', '2026-11-03 13:25:00', 1890, 'https://www.36kr.com', '2026-11-03 13:25:00'),
  (10, '大模型评测基准新增中文长文本任务集', '新任务集覆盖长文档摘要、跨段落检索与多轮指令遵循，补充了现有评测的空白。', '量子位', '人工智能', '林晓', '2026-11-02 15:50:00', 2670, 'https://www.qbitai.com', '2026-11-02 15:50:00'),
  (11, '可观测性平台开源统一指标采集协议', '协议在原有指标模型上增加语义标签与采样提示，便于跨云环境统一采集。', 'InfoQ', '开源生态', '杨庆鸿', '2026-11-02 08:30:00', 1330, 'https://www.infoq.cn', '2026-11-02 08:30:00'),
  (12, '零信任接入方案增加设备指纹动态校验', '方案将设备指纹与风险评分结合，在登录和敏感操作前执行差异化校验。', '36氪', '网络安全', '陈屿', '2026-11-01 11:00:00', 920, 'https://www.36kr.com', '2026-11-01 11:00:00');
```

