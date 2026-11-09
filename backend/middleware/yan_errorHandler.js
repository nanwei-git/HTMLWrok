// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

function yan_not_found_handler(yan_req, yan_res) {
  yan_res.status(404).json({
    code: 404,
    msg: '请求的资源不存在',
    data: {}
  });
}

function yan_error_handler(yan_err, yan_req, yan_res, yan_next) {
  console.error('[API Error]', yan_err.stack || yan_err.message);

  if (yan_res.headersSent) {
    return yan_next(yan_err);
  }

  return yan_res.status(500).json({
    code: 500,
    msg: '服务器内部错误',
    data: {}
  });
}

module.exports = {
  yan_not_found_handler,
  yan_error_handler
};
