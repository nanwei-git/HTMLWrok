// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-09 | 大模型：DeepSeek V4.1 Flash Free

const yan_app = require('./app');

const yan_port = 8509;

const yan_server = yan_app.listen(yan_port, () => {
  console.log(`云栖数据工坊已启动：http://localhost:${yan_port}`);
  console.log(`健康检查接口：http://localhost:${yan_port}/api/health`);
});

yan_server.on('error', (yan_error) => {
  console.error('服务启动失败：', yan_error);
  process.exitCode = 1;
});
