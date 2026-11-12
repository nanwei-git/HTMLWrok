// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_get_data_sources } = require('../models/yan_sourceModel');

async function yan_get_sources(yan_req, yan_res, yan_next) {
  try {
    const yan_data = await yan_get_data_sources();

    yan_res.json({
      code: 0,
      msg: '数据源列表获取成功',
      data: yan_data
    });
  } catch (yan_error) {
    yan_next(yan_error);
  }
}

module.exports = {
  yan_get_sources
};
