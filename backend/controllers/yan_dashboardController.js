// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_get_dashboard_data } = require('../models/yan_dashboardModel');
const { yan_get_project_info } = require('../models/yan_projectModel');

async function yan_get_dashboard(yan_req, yan_res, yan_next) {
  try {
    const yan_data = await yan_get_dashboard_data();

    yan_res.json({
      code: 0,
      msg: '工作台数据获取成功',
      data: {
        project: yan_get_project_info(),
        ...yan_data
      }
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

module.exports = {
  yan_get_dashboard
};
