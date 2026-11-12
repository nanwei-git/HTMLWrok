// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const yan_path = require('path');
const yan_dotenv = require('dotenv');

yan_dotenv.config({
  path: yan_path.join(__dirname, '..', '.env'),
  quiet: true
});

const yan_ai_api_key = process.env.AI_API_KEY || process.env.SILICONFLOW_API_KEY || '';
const yan_ai_api_url = process.env.AI_API_URL
  || process.env.SILICONFLOW_API_URL
  || 'https://api.deepseek.com/chat/completions';
const yan_ai_model = process.env.AI_MODEL
  || process.env.SILICONFLOW_MODEL
  || 'deepseek-flash';

function yan_resolve_ai_provider_name(yan_url) {
  const yan_source = String(yan_url || '').toLowerCase();

  if (yan_source.includes('deepseek.com')) {
    return 'DeepSeek';
  }

  if (yan_source.includes('siliconflow')) {
    return 'SiliconFlow';
  }

  return 'AI 服务';
}

const yan_ai_settings = Object.freeze({
  apiKey: yan_ai_api_key,
  apiUrl: yan_ai_api_url,
  model: yan_ai_model,
  provider: yan_resolve_ai_provider_name(yan_ai_api_url),
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
