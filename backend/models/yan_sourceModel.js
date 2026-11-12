// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');

async function yan_get_data_sources() {
  const [yan_rows] = await yan_pool.query(`
    SELECT
      yan_id,
      yan_name,
      yan_type,
      yan_host,
      yan_description,
      yan_status,
      yan_record_count,
      yan_last_synced_at,
      yan_created_at
    FROM yan_data_sources
    ORDER BY FIELD(yan_status, 'error', 'syncing', 'connected'), yan_id ASC
  `);

  const yan_sources = yan_rows.map((yan_row) => ({
    id: Number(yan_row.yan_id),
    name: yan_row.yan_name,
    type: yan_row.yan_type,
    host: yan_row.yan_host,
    description: yan_row.yan_description,
    status: yan_row.yan_status,
    recordCount: Number(yan_row.yan_record_count),
    lastSyncedAt: yan_row.yan_last_synced_at,
    createdAt: yan_row.yan_created_at
  }));

  const yan_summary = {
    total: yan_sources.length,
    connected: yan_sources.filter((yan_source) => yan_source.status === 'connected').length,
    syncing: yan_sources.filter((yan_source) => yan_source.status === 'syncing').length,
    error: yan_sources.filter((yan_source) => yan_source.status === 'error').length,
    totalRecords: yan_sources.reduce((yan_total, yan_source) => yan_total + yan_source.recordCount, 0)
  };

  return {
    sources: yan_sources,
    summary: yan_summary
  };
}

module.exports = {
  yan_get_data_sources
};
