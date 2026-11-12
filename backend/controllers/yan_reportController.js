// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const {
  yan_list_reports,
  yan_get_report_by_id
} = require('../models/yan_reportModel');

function yan_parse_id(yan_value) {
  const yan_id = Number.parseInt(yan_value, 10);
  return Number.isInteger(yan_id) && yan_id > 0 ? yan_id : null;
}

async function yan_get_reports(yan_req, yan_res, yan_next) {
  try {
    const yan_reports = await yan_list_reports({
      category: yan_req.query.category,
      status: yan_req.query.status
    });

    yan_res.json({
      code: 0,
      msg: '报表列表获取成功',
      data: {
        reports: yan_reports
      }
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

async function yan_get_report_detail(yan_req, yan_res, yan_next) {
  const yan_report_id = yan_parse_id(yan_req.params.id);

  if (!yan_report_id) {
    yan_res.status(400).json({
      code: 400,
      msg: '报表 ID 格式不正确',
      data: {}
    });
    return;
  }

  try {
    const yan_report = await yan_get_report_by_id(yan_report_id);

    if (!yan_report) {
      yan_res.status(404).json({
        code: 404,
        msg: '报表不存在',
        data: {}
      });
      return;
    }

    yan_res.json({
      code: 0,
      msg: '报表详情获取成功',
      data: {
        report: yan_report
      }
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

module.exports = {
  yan_get_reports,
  yan_get_report_detail
};
