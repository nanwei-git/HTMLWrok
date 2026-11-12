// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');
const { yan_build_download_url } = require('../config/yan_uploadConfig');

function yan_map_upload(yan_row) {
  return {
    id: Number(yan_row.yan_id),
    originalName: yan_row.yan_original_name,
    extension: yan_row.yan_extension,
    mimeType: yan_row.yan_mime_type,
    sizeBytes: Number(yan_row.yan_size_bytes),
    category: yan_row.yan_category,
    description: yan_row.yan_description,
    uploader: yan_row.yan_uploader,
    isSeed: Number(yan_row.yan_is_seed) === 1,
    uploadedAt: yan_row.yan_uploaded_at,
    downloadUrl: yan_build_download_url(yan_row.yan_stored_name)
  };
}

async function yan_get_upload_summary() {
  const [yan_rows] = await yan_pool.query(`
    SELECT
      COUNT(*) AS yan_total,
      COALESCE(SUM(yan_size_bytes), 0) AS yan_total_size_bytes,
      COALESCE(SUM(yan_is_seed), 0) AS yan_seed_count,
      COUNT(DISTINCT yan_category) AS yan_category_count,
      MAX(yan_uploaded_at) AS yan_latest_uploaded_at
    FROM yan_uploads
  `);

  const [yan_category_rows] = await yan_pool.query(`
    SELECT yan_category, COUNT(*) AS yan_count
    FROM yan_uploads
    GROUP BY yan_category
    ORDER BY yan_count DESC, yan_category ASC
  `);

  const yan_summary_row = yan_rows[0];

  return {
    total: Number(yan_summary_row.yan_total),
    totalSizeBytes: Number(yan_summary_row.yan_total_size_bytes),
    seedCount: Number(yan_summary_row.yan_seed_count),
    categoryCount: Number(yan_summary_row.yan_category_count),
    latestUploadedAt: yan_summary_row.yan_latest_uploaded_at,
    categories: yan_category_rows.map((yan_row) => ({
      category: yan_row.yan_category,
      count: Number(yan_row.yan_count)
    }))
  };
}

async function yan_list_uploads(yan_category) {
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
        yan_original_name,
        yan_stored_name,
        yan_extension,
        yan_mime_type,
        yan_size_bytes,
        yan_category,
        yan_description,
        yan_uploader,
        yan_is_seed,
        yan_uploaded_at
      FROM yan_uploads
      ${yan_where}
      ORDER BY yan_uploaded_at DESC, yan_id DESC
    `,
    yan_params
  );

  return {
    uploads: yan_rows.map(yan_map_upload),
    summary: await yan_get_upload_summary()
  };
}

async function yan_create_upload(yan_metadata) {
  const [yan_result] = await yan_pool.execute(
    `
      INSERT INTO yan_uploads
        (
          yan_original_name,
          yan_stored_name,
          yan_extension,
          yan_mime_type,
          yan_size_bytes,
          yan_category,
          yan_description,
          yan_uploader,
          yan_is_seed
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    [
      yan_metadata.originalName,
      yan_metadata.storedName,
      yan_metadata.extension,
      yan_metadata.mimeType,
      yan_metadata.sizeBytes,
      yan_metadata.category,
      yan_metadata.description,
      yan_metadata.uploader
    ]
  );

  const [yan_rows] = await yan_pool.execute(
    `
      SELECT
        yan_id,
        yan_original_name,
        yan_stored_name,
        yan_extension,
        yan_mime_type,
        yan_size_bytes,
        yan_category,
        yan_description,
        yan_uploader,
        yan_is_seed,
        yan_uploaded_at
      FROM yan_uploads
      WHERE yan_id = ?
    `,
    [yan_result.insertId]
  );

  return yan_map_upload(yan_rows[0]);
}

async function yan_get_upload_for_delete(yan_id) {
  const [yan_rows] = await yan_pool.execute(
    `
      SELECT
        yan_id,
        yan_original_name,
        yan_stored_name,
        yan_is_seed
      FROM yan_uploads
      WHERE yan_id = ?
    `,
    [yan_id]
  );

  return yan_rows[0] || null;
}

async function yan_delete_upload(yan_id) {
  const [yan_result] = await yan_pool.execute(
    'DELETE FROM yan_uploads WHERE yan_id = ?',
    [yan_id]
  );

  return yan_result.affectedRows;
}

module.exports = {
  yan_list_uploads,
  yan_create_upload,
  yan_get_upload_for_delete,
  yan_delete_upload
};
