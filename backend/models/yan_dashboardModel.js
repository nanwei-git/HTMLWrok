// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');

function yan_pad_number(yan_value) {
  return String(yan_value).padStart(2, '0');
}

function yan_build_date_key(yan_date) {
  return [
    yan_date.getFullYear(),
    yan_pad_number(yan_date.getMonth() + 1),
    yan_pad_number(yan_date.getDate())
  ].join('-');
}

async function yan_get_dashboard_data() {
  const [yan_stats_rows] = await yan_pool.query(`
    SELECT
      (SELECT COUNT(*) FROM yan_data_sources) AS yan_data_sources,
      (SELECT COUNT(*) FROM yan_workflows WHERE yan_status = 'active') AS yan_active_workflows,
      (SELECT COUNT(*) FROM yan_reports WHERE yan_status = 'published') AS yan_published_reports,
      (SELECT COUNT(*) FROM yan_workflow_runs) AS yan_total_runs,
      (SELECT COUNT(*) FROM yan_workflow_runs WHERE DATE(yan_started_at) = CURDATE()) AS yan_today_runs,
      (SELECT COALESCE(SUM(yan_rows_processed), 0) FROM yan_workflow_runs) AS yan_rows_processed,
      (SELECT ROUND(SUM(yan_status = 'success') / NULLIF(COUNT(*), 0) * 100, 1) FROM yan_workflow_runs) AS yan_success_rate
  `);

  const yan_stats_row = yan_stats_rows[0];
  const yan_stats = {
    dataSources: Number(yan_stats_row.yan_data_sources),
    activeWorkflows: Number(yan_stats_row.yan_active_workflows),
    publishedReports: Number(yan_stats_row.yan_published_reports),
    totalRuns: Number(yan_stats_row.yan_total_runs),
    todayRuns: Number(yan_stats_row.yan_today_runs),
    rowsProcessed: Number(yan_stats_row.yan_rows_processed),
    successRate: Number(yan_stats_row.yan_success_rate || 0)
  };

  const yan_today = new Date();
  yan_today.setHours(0, 0, 0, 0);

  const yan_days = Array.from({ length: 7 }, (_, yan_index) => {
    const yan_day = new Date(yan_today);
    yan_day.setDate(yan_today.getDate() - (6 - yan_index));

    return {
      key: yan_build_date_key(yan_day),
      label: `${yan_pad_number(yan_day.getMonth() + 1)}-${yan_pad_number(yan_day.getDate())}`
    };
  });

  const [yan_weekly_rows] = await yan_pool.query(
    `
      SELECT DATE_FORMAT(yan_created_at, '%Y-%m-%d') AS yan_date, COUNT(*) AS yan_count
      FROM yan_reports
      WHERE yan_created_at >= ?
      GROUP BY DATE_FORMAT(yan_created_at, '%Y-%m-%d')
      ORDER BY DATE_FORMAT(yan_created_at, '%Y-%m-%d')
    `,
    [`${yan_days[0].key} 00:00:00`]
  );

  const yan_weekly_map = new Map(
    yan_weekly_rows.map((yan_row) => [yan_row.yan_date, Number(yan_row.yan_count)])
  );

  const yan_weekly_output = yan_days.map((yan_day) => ({
    label: yan_day.label,
    value: yan_weekly_map.get(yan_day.key) || 0
  }));

  const [yan_category_rows] = await yan_pool.query(`
    SELECT yan_category, COUNT(*) AS yan_count
    FROM yan_reports
    GROUP BY yan_category
    ORDER BY yan_count DESC, yan_category ASC
  `);

  const yan_category_distribution = yan_category_rows.map((yan_row) => ({
    category: yan_row.yan_category,
    count: Number(yan_row.yan_count)
  }));

  const [yan_run_rows] = await yan_pool.query(`
    SELECT
      r.yan_id,
      r.yan_workflow_id,
      r.yan_status,
      r.yan_duration_seconds,
      r.yan_rows_processed,
      r.yan_trigger_type,
      r.yan_started_at,
      w.yan_name AS yan_workflow_name
    FROM yan_workflow_runs r
    INNER JOIN yan_workflows w ON w.yan_id = r.yan_workflow_id
    ORDER BY r.yan_started_at DESC
    LIMIT 6
  `);

  const yan_recent_runs = yan_run_rows.map((yan_row) => ({
    id: Number(yan_row.yan_id),
    workflowId: Number(yan_row.yan_workflow_id),
    workflowName: yan_row.yan_workflow_name,
    status: yan_row.yan_status,
    durationSeconds: Number(yan_row.yan_duration_seconds),
    rowsProcessed: Number(yan_row.yan_rows_processed),
    triggerType: yan_row.yan_trigger_type,
    startedAt: yan_row.yan_started_at
  }));

  const [yan_report_rows] = await yan_pool.query(`
    SELECT yan_id, yan_title, yan_category, yan_status, yan_owner, yan_views, yan_updated_at
    FROM yan_reports
    ORDER BY yan_updated_at DESC
    LIMIT 4
  `);

  const yan_latest_reports = yan_report_rows.map((yan_row) => ({
    id: Number(yan_row.yan_id),
    title: yan_row.yan_title,
    category: yan_row.yan_category,
    status: yan_row.yan_status,
    owner: yan_row.yan_owner,
    views: Number(yan_row.yan_views),
    updatedAt: yan_row.yan_updated_at
  }));

  return {
    stats: yan_stats,
    weeklyOutput: yan_weekly_output,
    categoryDistribution: yan_category_distribution,
    recentRuns: yan_recent_runs,
    latestReports: yan_latest_reports
  };
}

module.exports = {
  yan_get_dashboard_data
};
