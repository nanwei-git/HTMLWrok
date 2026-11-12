// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');

function yan_map_news(yan_row) {
  return {
    id: Number(yan_row.yan_id),
    title: yan_row.yan_title,
    summary: yan_row.yan_summary,
    source: yan_row.yan_source,
    category: yan_row.yan_category,
    author: yan_row.yan_author,
    publishedAt: yan_row.yan_published_at,
    readCount: Number(yan_row.yan_read_count),
    url: yan_row.yan_url
  };
}

async function yan_list_tech_news(yan_category) {
  const yan_params = [];
  let yan_where = '';

  if (typeof yan_category === 'string' && yan_category.trim()) {
    yan_where = 'WHERE yan_category = ?';
    yan_params.push(yan_category.trim());
  }

  const [yan_rows] = await yan_pool.query(
    `
      SELECT
        yan_id,
        yan_title,
        yan_summary,
        yan_source,
        yan_category,
        yan_author,
        yan_published_at,
        yan_read_count,
        yan_url
      FROM yan_tech_news
      ${yan_where}
      ORDER BY yan_published_at DESC, yan_id DESC
    `,
    yan_params
  );

  const [yan_summary_rows] = await yan_pool.query(`
    SELECT
      COUNT(*) AS yan_total,
      COUNT(DISTINCT yan_category) AS yan_category_count,
      COUNT(DISTINCT yan_source) AS yan_source_count,
      MAX(yan_published_at) AS yan_latest_published_at
    FROM yan_tech_news
  `);

  const yan_summary_row = yan_summary_rows[0];

  return {
    news: yan_rows.map(yan_map_news),
    summary: {
      total: Number(yan_summary_row.yan_total),
      categoryCount: Number(yan_summary_row.yan_category_count),
      sourceCount: Number(yan_summary_row.yan_source_count),
      latestPublishedAt: yan_summary_row.yan_latest_published_at
    }
  };
}

module.exports = {
  yan_list_tech_news
};
