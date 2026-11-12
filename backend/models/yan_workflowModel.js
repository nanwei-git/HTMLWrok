// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_pool } = require('../config/yan_db');

function yan_map_workflow(yan_row) {
  return {
    id: Number(yan_row.yan_id),
    name: yan_row.yan_name,
    description: yan_row.yan_description,
    owner: yan_row.yan_owner,
    status: yan_row.yan_status,
    schedule: yan_row.yan_schedule,
    lastRunAt: yan_row.yan_last_run_at,
    successRate: Number(yan_row.yan_success_rate || 0),
    stepCount: Number(yan_row.yan_step_count || 0),
    createdAt: yan_row.yan_created_at,
    updatedAt: yan_row.yan_updated_at
  };
}

function yan_map_step(yan_row) {
  return {
    id: Number(yan_row.yan_id),
    order: Number(yan_row.yan_step_order),
    name: yan_row.yan_name,
    type: yan_row.yan_step_type,
    configSummary: yan_row.yan_config_summary,
    status: yan_row.yan_status
  };
}

function yan_map_run(yan_row) {
  return {
    id: Number(yan_row.yan_id),
    workflowId: Number(yan_row.yan_workflow_id),
    workflowName: yan_row.yan_workflow_name || null,
    status: yan_row.yan_status,
    durationSeconds: Number(yan_row.yan_duration_seconds),
    rowsProcessed: Number(yan_row.yan_rows_processed),
    triggerType: yan_row.yan_trigger_type,
    startedAt: yan_row.yan_started_at,
    finishedAt: yan_row.yan_finished_at
  };
}

async function yan_list_workflows(yan_status) {
  const yan_params = [];
  let yan_where = '';

  if (yan_status && ['active', 'paused', 'draft'].includes(yan_status)) {
    yan_where = 'WHERE w.yan_status = ?';
    yan_params.push(yan_status);
  }

  const [yan_rows] = await yan_pool.query(
    `
      SELECT w.*, COUNT(s.yan_id) AS yan_step_count
      FROM yan_workflows w
      LEFT JOIN yan_workflow_steps s ON s.yan_workflow_id = w.yan_id
      ${yan_where}
      GROUP BY w.yan_id
      ORDER BY FIELD(w.yan_status, 'active', 'paused', 'draft'), w.yan_id ASC
    `,
    yan_params
  );

  return yan_rows.map(yan_map_workflow);
}

async function yan_get_workflow_by_id(yan_workflow_id) {
  const [yan_workflow_rows] = await yan_pool.query(
    `
      SELECT w.*, COUNT(s.yan_id) AS yan_step_count
      FROM yan_workflows w
      LEFT JOIN yan_workflow_steps s ON s.yan_workflow_id = w.yan_id
      WHERE w.yan_id = ?
      GROUP BY w.yan_id
      LIMIT 1
    `,
    [yan_workflow_id]
  );

  if (!yan_workflow_rows.length) {
    return null;
  }

  const [yan_step_rows] = await yan_pool.query(
    `
      SELECT yan_id, yan_step_order, yan_name, yan_step_type, yan_config_summary, yan_status
      FROM yan_workflow_steps
      WHERE yan_workflow_id = ?
      ORDER BY yan_step_order ASC
    `,
    [yan_workflow_id]
  );

  const [yan_run_rows] = await yan_pool.query(
    `
      SELECT r.*, w.yan_name AS yan_workflow_name
      FROM yan_workflow_runs r
      INNER JOIN yan_workflows w ON w.yan_id = r.yan_workflow_id
      WHERE r.yan_workflow_id = ?
      ORDER BY r.yan_started_at DESC
      LIMIT 8
    `,
    [yan_workflow_id]
  );

  return {
    workflow: yan_map_workflow(yan_workflow_rows[0]),
    steps: yan_step_rows.map(yan_map_step),
    runs: yan_run_rows.map(yan_map_run)
  };
}

async function yan_create_manual_run(yan_workflow_id) {
  const yan_connection = await yan_pool.getConnection();

  try {
    await yan_connection.beginTransaction();

    const [yan_workflow_rows] = await yan_connection.query(
      `
        SELECT yan_id, yan_name, yan_status
        FROM yan_workflows
        WHERE yan_id = ?
        FOR UPDATE
      `,
      [yan_workflow_id]
    );

    if (!yan_workflow_rows.length) {
      await yan_connection.rollback();
      return { error: 'not_found' };
    }

    if (yan_workflow_rows[0].yan_status !== 'active') {
      await yan_connection.rollback();
      return { error: 'inactive' };
    }

    const yan_duration_seconds = 35 + Math.floor(Math.random() * 86);
    const yan_rows_processed = 1800 + Math.floor(Math.random() * 7200);

    const [yan_insert_result] = await yan_connection.query(
      `
        INSERT INTO yan_workflow_runs
          (yan_workflow_id, yan_status, yan_duration_seconds, yan_rows_processed, yan_trigger_type, yan_started_at, yan_finished_at)
        VALUES
          (?, 'success', ?, ?, 'manual', NOW(), TIMESTAMPADD(SECOND, ?, NOW()))
      `,
      [yan_workflow_id, yan_duration_seconds, yan_rows_processed, yan_duration_seconds]
    );

    await yan_connection.query(
      `
        UPDATE yan_workflows w
        SET
          w.yan_last_run_at = NOW(),
          w.yan_success_rate = (
            SELECT ROUND(SUM(r.yan_status = 'success') / NULLIF(COUNT(*), 0) * 100, 1)
            FROM yan_workflow_runs r
            WHERE r.yan_workflow_id = w.yan_id
          )
        WHERE w.yan_id = ?
      `,
      [yan_workflow_id]
    );

    await yan_connection.commit();

    const [yan_run_rows] = await yan_pool.query(
      `
        SELECT r.*, w.yan_name AS yan_workflow_name
        FROM yan_workflow_runs r
        INNER JOIN yan_workflows w ON w.yan_id = r.yan_workflow_id
        WHERE r.yan_id = ?
        LIMIT 1
      `,
      [yan_insert_result.insertId]
    );

    const yan_workflow = await yan_get_workflow_by_id(yan_workflow_id);

    return {
      run: yan_map_run(yan_run_rows[0]),
      workflow: yan_workflow.workflow
    };
  } catch (yan_error) {
    await yan_connection.rollback();
    throw yan_error;
  } finally {
    yan_connection.release();
  }
}

module.exports = {
  yan_list_workflows,
  yan_get_workflow_by_id,
  yan_create_manual_run
};
