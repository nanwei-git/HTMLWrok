// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const yan_path = require('path');
const yan_dotenv = require('dotenv');

yan_dotenv.config({
  path: yan_path.join(__dirname, '..', '.env'),
  quiet: true
});

const yan_ai_settings = Object.freeze({
  apiKey: process.env.SILICONFLOW_API_KEY || '',
  apiUrl: process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions',
  model: process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash',
  systemPrompt: [
    '你是云栖数据工坊的 AI 助手，擅长数据分析、数据工作流、报表设计、MySQL 与原生前端开发。',
    '请使用简洁、准确的中文回答。',
    '涉及代码时优先给出可以直接运行的示例，并说明必要的执行步骤。',
    '不要编造不确定的数据；如果信息不足，请明确说明假设或需要补充的条件。'
  ].join('\n'),
  maxMessages: 20,
  maxContentLength: 4000,
  timeoutMs: 60000
});

module.exports = {
  yan_ai_settings
};
