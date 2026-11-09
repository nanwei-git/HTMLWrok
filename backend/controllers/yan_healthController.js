// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const { yan_get_project_info } = require('../models/yan_projectModel');

function yan_get_health(yan_req, yan_res) {
  const yan_project_info = yan_get_project_info();

  yan_res.json({
    code: 0,
    msg: '服务运行正常',
    data: {
      status: 'ok',
      project: yan_project_info,
      runtime: {
        node: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime())
      },
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = {
  yan_get_health
};
