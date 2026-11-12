// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const {
  yan_list_workflows,
  yan_get_workflow_by_id,
  yan_create_manual_run
} = require('../models/yan_workflowModel');

function yan_parse_id(yan_value) {
  const yan_id = Number.parseInt(yan_value, 10);
  return Number.isInteger(yan_id) && yan_id > 0 ? yan_id : null;
}

async function yan_get_workflows(yan_req, yan_res, yan_next) {
  try {
    const yan_workflows = await yan_list_workflows(yan_req.query.status);

    yan_res.json({
      code: 0,
      msg: '工作流列表获取成功',
      data: {
        workflows: yan_workflows
      }
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

async function yan_get_workflow_detail(yan_req, yan_res, yan_next) {
  const yan_workflow_id = yan_parse_id(yan_req.params.id);

  if (!yan_workflow_id) {
    yan_res.status(400).json({
      code: 400,
      msg: '工作流 ID 格式不正确',
      data: {}
    });
    return;
  }

  try {
    const yan_data = await yan_get_workflow_by_id(yan_workflow_id);

    if (!yan_data) {
      yan_res.status(404).json({
        code: 404,
        msg: '工作流不存在',
        data: {}
      });
      return;
    }

    yan_res.json({
      code: 0,
      msg: '工作流详情获取成功',
      data: yan_data
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

async function yan_run_workflow(yan_req, yan_res, yan_next) {
  const yan_workflow_id = yan_parse_id(yan_req.params.id);

  if (!yan_workflow_id) {
    yan_res.status(400).json({
      code: 400,
      msg: '工作流 ID 格式不正确',
      data: {}
    });
    return;
  }

  try {
    const yan_result = await yan_create_manual_run(yan_workflow_id);

    if (yan_result.error === 'not_found') {
      yan_res.status(404).json({
        code: 404,
        msg: '工作流不存在',
        data: {}
      });
      return;
    }

    if (yan_result.error === 'inactive') {
      yan_res.status(409).json({
        code: 409,
        msg: '仅运行中的工作流可以手动执行',
        data: {}
      });
      return;
    }

    yan_res.json({
      code: 0,
      msg: '工作流执行成功',
      data: yan_result
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

module.exports = {
  yan_get_workflows,
  yan_get_workflow_detail,
  yan_run_workflow
};
