// 姓名：杨庆鸿 | 学号：24002120509
// 时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free

const { yan_request_chat_completion } = require('../models/yan_chatModel');
const { yan_ai_settings } = require('../config/yan_ai');

function yan_get_chat_info(yan_req, yan_res) {
  yan_res.json({
    code: 0,
    msg: 'AI 对话接口说明',
    data: {
      method: 'POST',
      path: '/api/chat',
      model: yan_ai_settings.model,
      stream: false,
      messageLimit: yan_ai_settings.maxMessages,
      contentLimit: yan_ai_settings.maxContentLength,
      keyConfigured: Boolean(yan_ai_settings.apiKey)
    }
  });
}

function yan_map_chat_error(yan_error) {
  if (yan_error.code === 'YAN_AI_KEY_MISSING') {
    return {
      status: 503,
      msg: 'AI 服务尚未配置 API Key，请检查后端环境变量'
    };
  }

  if (yan_error.code === 'YAN_AI_TIMEOUT') {
    return {
      status: 504,
      msg: 'AI 服务响应超时，请稍后重试'
    };
  }

  if (yan_error.code === 'YAN_AI_NETWORK_ERROR') {
    return {
      status: 503,
      msg: '无法连接 AI 服务，请检查服务器网络'
    };
  }

  if (yan_error.code === 'YAN_AI_EMPTY_RESPONSE') {
    return {
      status: 502,
      msg: 'AI 服务返回了空回复，请稍后重试'
    };
  }

  if (yan_error.code === 'YAN_AI_UPSTREAM_ERROR') {
    if (yan_error.upstreamStatus === 401 || yan_error.upstreamStatus === 403) {
      return {
        status: 502,
        msg: 'AI 服务鉴权失败，请检查后端 API Key 配置'
      };
    }

    if (yan_error.upstreamStatus === 429) {
      return {
        status: 429,
        msg: 'AI 服务请求过于频繁，请稍后重试'
      };
    }

    if (yan_error.upstreamStatus >= 500) {
      return {
        status: 503,
        msg: 'AI 服务暂时不可用，请稍后重试'
      };
    }

    return {
      status: 502,
      msg: 'AI 服务拒绝了本次请求，请检查模型配置'
    };
  }

  return {
    status: 500,
    msg: 'AI 对话请求失败，请稍后重试'
  };
}

async function yan_chat(yan_req, yan_res) {
  const yan_raw_messages = yan_req.body && Array.isArray(yan_req.body.messages)
    ? yan_req.body.messages
    : null;

  if (!yan_raw_messages || !yan_raw_messages.length) {
    yan_res.status(400).json({
      code: 400,
      msg: '请提供 messages 对话消息数组',
      data: {}
    });
    return;
  }

  if (yan_raw_messages.length > yan_ai_settings.maxMessages) {
    yan_res.status(400).json({
      code: 400,
      msg: `单次请求最多支持 ${yan_ai_settings.maxMessages} 条消息`,
      data: {}
    });
    return;
  }

  const yan_messages = [];

  for (const yan_item of yan_raw_messages) {
    if (!yan_item || (yan_item.role !== 'user' && yan_item.role !== 'assistant')) {
      yan_res.status(400).json({
        code: 400,
        msg: '消息角色只允许 user 或 assistant',
        data: {}
      });
      return;
    }

    if (typeof yan_item.content !== 'string') {
      yan_res.status(400).json({
        code: 400,
        msg: '消息内容必须是字符串',
        data: {}
      });
      return;
    }

    const yan_content = yan_item.content.trim();

    if (!yan_content) {
      yan_res.status(400).json({
        code: 400,
        msg: '消息内容不能为空',
        data: {}
      });
      return;
    }

    if (yan_content.length > yan_ai_settings.maxContentLength) {
      yan_res.status(400).json({
        code: 400,
        msg: `单条消息不能超过 ${yan_ai_settings.maxContentLength} 个字符`,
        data: {}
      });
      return;
    }

    yan_messages.push({
      role: yan_item.role,
      content: yan_content
    });
  }

  if (yan_messages[yan_messages.length - 1].role !== 'user') {
    yan_res.status(400).json({
      code: 400,
      msg: '最后一条消息必须来自 user',
      data: {}
    });
    return;
  }

  try {
    const yan_data = await yan_request_chat_completion(yan_messages);

    yan_res.json({
      code: 0,
      msg: 'AI 回复成功',
      data: yan_data
    });
  } catch (yan_error) {
    const yan_failure = yan_map_chat_error(yan_error);

    console.error('[AI 对话] 请求失败：', {
      code: yan_error.code || 'UNKNOWN_ERROR',
      upstreamStatus: yan_error.upstreamStatus || null,
      message: yan_error.message
    });

    yan_res.status(yan_failure.status).json({
      code: yan_failure.status,
      msg: yan_failure.msg,
      data: {
        reason: yan_error.code || 'UNKNOWN_ERROR',
        upstreamStatus: yan_error.upstreamStatus || null
      }
    });
  }
}

module.exports = {
  yan_get_chat_info,
  yan_chat
};
