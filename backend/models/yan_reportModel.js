// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');

function yan_parse_json_array(yan_value) {
  if (Array.isArray(yan_value)) {
    return yan_value;
  }

  if (typeof yan_value === 'string') {
    try {
      const yan_parsed = JSON.parse(yan_value);
      return Array.isArray(yan_parsed) ? yan_parsed : [];
    } catch (yan_error) {
      console.error('[报表数据] JSON 解析失败：', yan_error);
      return [];
    }
  }

  return [];
}

function yan_map_report(yan_row) {
  const yan_labels = yan_parse_json_array(yan_row.yan_chart_labels).map(String);
  const yan_values = yan_parse_json_array(yan_row.yan_chart_values).map(Number);
  const yan_first_value = Number(yan_values[0] || 0);
  const yan_last_value = Number(yan_values[yan_values.length - 1] || 0);
  const yan_change = yan_first_value
    ? Number((((yan_last_value - yan_first_value) / yan_first_value) * 100).toFixed(1))
    : 0;

  return {
    id: Number(yan_row.yan_id),
    workflowId: yan_row.yan_workflow_id ? Number(yan_row.yan_workflow_id) : null,
    workflowName: yan_row.yan_workflow_name || null,
    workflowStatus: yan_row.yan_workflow_status || null,
    title: yan_row.yan_title,
    category: yan_row.yan_category,
    summary: yan_row.yan_summary,
    status: yan_row.yan_status,
    owner: yan_row.yan_owner,
    views: Number(yan_row.yan_views),
    chartLabels: yan_labels,
    chartValues: yan_values,
    chartChange: yan_change,
    createdAt: yan_row.yan_created_at,
    updatedAt: yan_row.yan_updated_at
  };
}

async function yan_list_reports(yan_filters = {}) {
  const yan_conditions = [];
  const yan_params = [];

  if (typeof yan_filters.category === 'string' && yan_filters.category.trim()) {
    yan_conditions.push('r.yan_category = ?');
    yan_params.push(yan_filters.category.trim());
  }

  if (typeof yan_filters.status === 'string' && ['published', 'review', 'draft'].includes(yan_filters.status)) {
    yan_conditions.push('r.yan_status = ?');
    yan_params.push(yan_filters.status);
  }

  const yan_where = yan_conditions.length ? `WHERE ${yan_conditions.join(' AND ')}` : '';

  const [yan_rows] = await yan_pool.query(
    `
      SELECT r.*, w.yan_name AS yan_workflow_name, w.yan_status AS yan_workflow_status
      FROM yan_reports r
      LEFT JOIN yan_workflows w ON w.yan_id = r.yan_workflow_id
      ${yan_where}
      ORDER BY r.yan_updated_at DESC, r.yan_id DESC
    `,
    yan_params
  );

  return yan_rows.map(yan_map_report);
}

async function yan_get_report_by_id(yan_report_id) {
  const [yan_rows] = await yan_pool.query(
    `
      SELECT r.*, w.yan_name AS yan_workflow_name, w.yan_status AS yan_workflow_status
      FROM yan_reports r
      LEFT JOIN yan_workflows w ON w.yan_id = r.yan_workflow_id
      WHERE r.yan_id = ?
      LIMIT 1
    `,
    [yan_report_id]
  );

  if (!yan_rows.length) {
    return null;
  }

  return yan_map_report(yan_rows[0]);
}

module.exports = {
  yan_list_reports,
  yan_get_report_by_id
};
